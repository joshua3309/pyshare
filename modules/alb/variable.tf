variable "domain" {
  description  = "The main for ACM cert"
  type         = string 
}

variable "lb_sg" {
  description  = "load balancer security group"
  type         = string 
}

variable "lb_subnets" {
  description = "Load balancer subnet IDs"
  type        = list(string)
}


variable "logs_enabled" {
  description  = ""
  type         = string 
}

variable "logs_prefix" {
  description  = ""
  type         = string 
}

variable "alb_5xx_threshold" {
  type  = number
  default = 20 
}

variable "lb_ssl_policy" {
  description = "alb ssl policy"
  type   = string
}

variable "target_5xx_threshold" {
  type = number
  default = 20
}


variable "logs_bucket" {
  description = "ALB logs bucket name"
  type        = string
}

variable "logs_expiration" {
  description = "ALB log expiration for s3"
  type        = number
}

variable "create_aliases" {
  type        = list(map(string))
  description = "List of DNS Aliases to create pointing at the ALB"
}

variable "waf_secret_header_value" {
  description = "value of secret header to ensure that waf request comes from backend"
  type       = string
}

variable "custom_waf_rules" {
  type        = bool
  description = "True if custom waf should be enabled"
  default     = true
}

variable "rate_subdomain_rules" {
  type = list(object({
    domain = string
    action    = string
    limit     = number
    window    = number
    name      = string
    priority  = number
  }))

  default = [
    {
      name      = "rate-admin-subdomain-limit"
      domain    = "admin.downloadloadbriefly.shop"
      action    = "block"
      limit     = 200
      window    = 300
      priority  = 3
    },
    {
      name     = "rate-api-subdomain-limit"
      priority = 4
      domain   = "api.downloadloadbriefly.shop"
      limit    = 200
      window   = 300
      action   = "count"
    }
  ]
}


variable "rate_url_rules" {
  description = "Path based rate limiting rules"

  type = list(object({
    name                  = string
    priority              = number
    search_string         = string
    positional_constraint = string
    limit                 = number
    window                = number
    action                = string
    metric_name           = optional(string)
  }))

  default = [
    {
      name                  = "login"
      priority              = 5
      search_string         = "/login"
      positional_constraint = "STARTS_WITH"
      limit                 = 15
      window                = 300
      action                = "block"
    },

    {
      name                  = "register"
      priority              = 6
      search_string         = "/register"
      positional_constraint = "STARTS_WITH"
      limit                 = 10
      window                = 300
      action                = "block"
    },

    {
      name                  = "otp"
      priority              = 7
      search_string         = "/api/otp"
      positional_constraint = "STARTS_WITH"
      limit                 = 5
      window                = 300
      action                = "block"
    },

    {
      name                  = "password-reset"
      priority              = 8
      search_string         = "/api/password-reset"
      positional_constraint = "STARTS_WITH"
      limit                 = 5
      window                = 300
      action                = "block"
    },

    {
      name                  = "payment"
      priority              = 9
      search_string         = "/api/payment"
      positional_constraint = "STARTS_WITH"
      limit                 = 8
      window                = 300
      action                = "block"
    },

    {
      name                  = "api-general"
      priority              = 10
      search_string         = "/api/"
      positional_constraint = "STARTS_WITH"
      limit                 = 300
      window                = 300
      action                = "block"
    },

    {
      name                  = "static-assets"
      priority              = 11
      search_string         = "/assets"
      positional_constraint = "STARTS_WITH"
      limit                 = 2000
      window                = 300
      action                = "count"
    },

    {
      name                  = "rate-api-all"
      priority              = 12
      search_string         = "test"
      metric_name           = "rate-api-all"
      positional_constraint = "CONTAINS"
      limit                 = 100
      window                = 300
      action                = "count"
    },


    {
      name                  = "health-check"
      priority              = 13
      search_string         = "/health"
      positional_constraint = "EXACTLY"
      limit                 = 300
      window                = 300
      action                = "allow"
    }
  ]
}

variable "rate_url_rules_with_or" {
  type = list(object({
    action        = string
    limit         = number
    metric_name   = string
    name          = string
    or_statements = list(map(string))
    priority      = number
  }))

  default = [
    {
      action      = "block"
      limit       = 100
      metric_name = "rate-or-condition-example"
      name        = "rate-or-condition-example"
      priority    = 14
      or_statements = [
        {
          positional_constraint = "STARTS_WITH"
          search_string         = "test"
        },
        {
          positional_constraint = "CONTAINS"
          search_string         = "favicon"
        }
      ]
    },

    # Authentication Group
    {
      name     = "auth-endpoints"
      metric_name = "auth-endpoints"
      priority = 15
      limit    = 20
      action   = "block"

      or_statements = [
        {
          search_string         = "/login"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/register"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/forgot-password"
          positional_constraint = "STARTS_WITH"
        }
      ]
    },

  # OTP Group
    {
      name     = "otp-endpoints"
      metric_name = "otp-endpoints"
      priority = 16
      limit    = 10
      action   = "block"

      or_statements = [
        {
          search_string         = "/api/otp/send"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/api/otp/resend"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/api/otp/verify"
          positional_constraint = "STARTS_WITH"
        }
      ]
    },

  # AI Group
    {
      name     = "ai-endpoints"
      metric_name = "ai-endpoints"
      priority = 17
      limit    = 50
      action   = "block"

      or_statements = [
        {
          search_string         = "/api/chat"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/api/completion"
          positional_constraint = "STARTS_WITH"
        },
        {
          search_string         = "/api/generate"
          positional_constraint = "STARTS_WITH"
        }
      ]
    }
  ]
}

variable "managed_rules" {
  type = list(object({
    name                    = string
    priority                = number
    version                 = string
    limit                   = number
    inspection_level        = optional(string)
    enable_machine_learning = optional(bool)
    excluded_rules          = list(string)
    blocking_rules          = list(string)
  }))

  description = "List of AWS Managed WAFv2 rules"

  default = [

    {
      name                    = "AWSManagedRulesAmazonIpReputationList"
      priority                = 18
      version                 = null
      limit                   = 1
      inspection_level        = null
      enable_machine_learning = null
      excluded_rules          = []
      blocking_rules = [
        "AWSManagedIPReputationList",
        "AWSManagedReconnaissanceList",
        "AWSManagedIPDDoSList"
      ]
    },

    {
      name                    = "AWSManagedRulesCommonRuleSet"
      priority                = 19
      version                 = "Version_1.10"
      limit                   = 1
      inspection_level        = null
      enable_machine_learning = null
      excluded_rules = [
        "NoUserAgent_HEADER",
        "UserAgent_BadBots_HEADER",
        "SizeRestrictions_BODY"
      ]
      blocking_rules = [
        "SizeRestrictions_URIPATH",
        "GenericLFI_URIPATH",
        "SizeRestrictions_QUERYSTRING",
        "SizeRestrictions_Cookie_HEADER",
        "EC2MetaDataSSRF_BODY",
        "EC2MetaDataSSRF_COOKIE",
        "EC2MetaDataSSRF_URIPATH",
        "EC2MetaDataSSRF_QUERYARGUMENTS",
        "GenericLFI_QUERYARGUMENTS",
        "GenericLFI_BODY",
        "RestrictedExtensions_URIPATH",
        "RestrictedExtensions_QUERYARGUMENTS",
        "GenericRFI_QUERYARGUMENTS",
        "GenericRFI_BODY",
        "GenericRFI_URIPATH",
        "CrossSiteScripting_COOKIE",
        "CrossSiteScripting_QUERYARGUMENTS",
        "CrossSiteScripting_BODY",
        "CrossSiteScripting_URIPATH"
      ]
    },

    {
      name                    = "AWSManagedRulesLinuxRuleSet"
      priority                = 20
      version                 = "Version_2.2"
      limit                   = 1
      inspection_level        = null
      enable_machine_learning = null
      excluded_rules          = []
      blocking_rules = [
        "LFI_URIPATH",
        "LFI_QUERYSTRING",
        "LFI_HEADER"
      ]
    },

    {
      name                    = "AWSManagedRulesSQLiRuleSet"
      priority                = 21
      version                 = "Version_1.1"
      limit                   = 1
      inspection_level        = null
      enable_machine_learning = null
      excluded_rules = [
        "SQLi_COOKIE"
      ]
      blocking_rules = [
        "SQLiExtendedPatterns_QUERYARGUMENTS",
        "SQLi_QUERYARGUMENTS",
        "SQLi_BODY",
        "SQLi_URIPATH"
      ]
    },

    {
      name                    = "AWSManagedRulesBotControlRuleSet"
      priority                = 22
      version                 = null
      limit                   = 1
      inspection_level        = "TARGETED"
      enable_machine_learning = true
      excluded_rules          = []
      blocking_rules          = []
    },

    {
      name                    = "AWSManagedRulesAnonymousIpList"
      priority                = 23
      version                 = null
      limit                   = 1
      inspection_level        = null
      enable_machine_learning = null
      excluded_rules          = []
      blocking_rules = [
        "AnonymousIPList",
        "HostingProviderIPList"
      ]
    }
  ]
}

variable "waf_rules_override_action" {
  description = "Two options: 'none' - rules are active, 'count' - they are only counted and requests are always passed on"
  default     = "none"
}

variable "ips_to_be_allowed" {
  description = "The list of IPs from EC2s to be allowed in WAF"
  type        = list(string)
  default     = []
}

variable "alarm_sns_topic_name" {
  type = string
}

variable "port" {
  description = "Port on which the application listens (e.g., 3000 for Node.js, 80 for HTTP)"
  type        = number
  default     = 3000
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where resources (ALB, target groups, etc.) will be created"
}