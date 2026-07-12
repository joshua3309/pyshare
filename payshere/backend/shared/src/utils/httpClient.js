import http from 'http';
import https from 'https';
import { logger } from './logger.js';
import { signServiceToken } from './jwt.js';
import { ServiceError } from '../middleware/errorHandler.js';

/**
 * Service Discovery
 *
 * In production (AWS): services register with ECS service discovery or
 * AWS Cloud Map. The ALB routes to each service via path-based rules.
 * Service URLs are injected via environment variables.
 *
 * In development: services run on different ports on localhost.
 *
 * Service URL resolution order:
 *   1. Environment variable (SERVICE_<NAME>_URL) — production
 *   2. localhost with known port — development
 */

const DEV_PORTS = {
  auth: 4001,
  user: 4002,
  payment: 4003,
  transaction: 4004,
  wallet: 4005,
  notification: 4006,
  billing: 4007,
};

export class ServiceDiscovery {
  /**
   * Resolve the base URL for a service.
   * @param {string} serviceName - e.g. 'auth', 'payment', 'wallet'
   * @returns {string} Base URL
   */
  static resolve(serviceName) {
    const envKey = `SERVICE_${serviceName.toUpperCase()}_URL`;
    const envUrl = process.env[envKey];
    if (envUrl) return envUrl.replace(/\/$/, '');

    // Development fallback
    const port = DEV_PORTS[serviceName];
    if (!port) {
      throw new ServiceError(
        `Unknown service: ${serviceName}`,
        500,
        'SERVICE_DISCOVERY_ERROR'
      );
    }
    return `http://localhost:${port}`;
  }
}

/**
 * HTTP client for inter-service communication.
 *
 * Features:
 *   - Automatic service token injection (JWT for internal auth)
 *   - Configurable timeout (default 5s)
 *   - Automatic retries with exponential backoff
 *   - Circuit breaker pattern (prevents cascade failures)
 *   - Structured logging of all inter-service calls
 */
export class HttpClient {
  constructor(options = {}) {
    this.timeout = options.timeout || 5000;
    this.maxRetries = options.maxRetries || 2;
    this.circuits = new Map(); // circuit breaker state per service
  }

  /**
   * Make an HTTP request to another microservice.
   * @param {string} serviceName - Target service name
   * @param {object} options - { method, path, body, headers, timeout }
   * @returns {Promise<object>} Parsed JSON response
   */
  async call(serviceName, options = {}) {
    const baseUrl = ServiceDiscovery.resolve(serviceName);
    const url = `${baseUrl}${options.path || '/'}`;
    const method = options.method || 'GET';

    // Circuit breaker check
    if (this.isCircuitOpen(serviceName)) {
      throw new ServiceError(
        `Circuit breaker open for ${serviceName}`,
        503,
        'CIRCUIT_OPEN'
      );
    }

    // Inject service token for internal auth
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.requireServiceAuth !== false) {
      try {
        const token = signServiceToken(process.env.SERVICE_NAME || 'unknown');
        headers['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        // Service token not configured — skip (dev mode)
      }
    }

    // Forward user's request ID for tracing
    if (options.requestId) {
      headers['X-Request-Id'] = options.requestId;
    }

    const body = options.body ? JSON.stringify(options.body) : undefined;

    logger.debug({
      message: 'Inter-service call',
      service: serviceName,
      method,
      url,
      from: process.env.SERVICE_NAME,
    });

    let lastError;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this._request(url, method, headers, body, options.timeout || this.timeout);
        this.recordSuccess(serviceName);
        return response;
      } catch (err) {
        lastError = err;
        if (attempt < this.maxRetries && err.statusCode >= 500) {
          // Exponential backoff: 100ms, 200ms, 400ms...
          await new Promise((r) => setTimeout(r, 100 * Math.pow(2, attempt)));
          continue;
        }
        this.recordFailure(serviceName);
        break;
      }
    }

    throw lastError || new ServiceError('Inter-service call failed', 502, 'SERVICE_CALL_FAILED');
  }

  _request(url, method, headers, body, timeout) {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      const parsedUrl = new URL(url);

      const req = lib.request(
        {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: parsedUrl.pathname + parsedUrl.search,
          method,
          headers,
          timeout,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode >= 400) {
              let errorBody;
              try {
                errorBody = JSON.parse(data);
              } catch {
                errorBody = { error: { message: data } };
              }
              const err = new ServiceError(
                errorBody?.error?.message || `Service returned ${res.statusCode}`,
                res.statusCode,
                errorBody?.error?.code || 'SERVICE_ERROR'
              );
              reject(err);
              return;
            }
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve(data);
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new ServiceError(`Request timeout to ${url}`, 504, 'REQUEST_TIMEOUT'));
      });

      req.on('error', (err) => {
        reject(new ServiceError(`Connection failed: ${err.message}`, 502, 'CONNECTION_FAILED'));
      });

      if (body) req.write(body);
      req.end();
    });
  }

  // ─── Circuit Breaker ──────────────────────────────────────────────────

  isCircuitOpen(serviceName) {
    const circuit = this.circuits.get(serviceName);
    if (!circuit) return false;
    if (circuit.state === 'open') {
      // Check if cooldown period has passed
      if (Date.now() - circuit.lastFailure > 30000) {
        // Half-open: allow one request through
        circuit.state = 'half-open';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(serviceName) {
    const circuit = this.circuits.get(serviceName) || {
      state: 'closed',
      failures: 0,
      lastFailure: 0,
    };
    circuit.state = 'closed';
    circuit.failures = 0;
    this.circuits.set(serviceName, circuit);
  }

  recordFailure(serviceName) {
    const circuit = this.circuits.get(serviceName) || {
      state: 'closed',
      failures: 0,
      lastFailure: 0,
    };
    circuit.failures++;
    circuit.lastFailure = Date.now();
    if (circuit.failures >= 5) {
      circuit.state = 'open';
      logger.warn({
        message: `Circuit breaker opened for ${serviceName}`,
        service: process.env.SERVICE_NAME,
      });
    }
    this.circuits.set(serviceName, circuit);
  }
}

// Singleton instance
export const httpClient = new HttpClient();
