const Module = require("node:module");

const semver = require('semver');

const originalRequire = Module.prototype.require;
const originalCompile = Module.prototype._compile;
const originalExtensions = Module._extensions['.js'];

Module.prototype.require = function(moduleId) {
  if (moduleId === 'node:http') {
    return {
      fake: true,
      source: 'cjs hook'
    };
  }

  return originalRequire.call(this, moduleId);
};

Module.prototype._compile = function(code, filename) {
  console.log('CJS -> _compile() called for', filename);
  return originalCompile.call(this, code, filename);
};

Module._extensions['.js'] = function(module, filename) {
  console.log('CJS -> _extensions[".js"] called for', filename);
  return originalExtensions.call(this, module, filename);
};

// set flag so we don't do this again.
global.__csi_cjshook = true;

if (semver.gte(process.version, '20.6.0')) {
  // this fails with no errors
  //Module.register('./hook.mjs');
} else {
  //throw new Error('non-register() hooks not yet implemented');
}
