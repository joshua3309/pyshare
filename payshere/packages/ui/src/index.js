// CommonJS entry point for runtime require() support
// This file is used by Node.js when requiring @workspace/ui outside of webpack
// During webpack compilation, transpilePackages handles the .ts/.tsx files
module.exports = require('./components/ui/button');
