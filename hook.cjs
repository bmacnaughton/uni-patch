const Module = require("node:module");

const originalRequire = Module.prototype.require;
const originalCompile = Module.prototype._compile;
const originalExtensions = Module._extensions['.js'];

Module.prototype.require = function(moduleId) {
  if (moduleId === "node:http") {
    return {
      fake: true,
      source: "cjs hook"
    };
  }

  return originalRequire.call(this, moduleId);
};

Module.prototype._compile = function(code, filename) {
  console.log("CJS -> _compile() called for", filename);
  return originalCompile.call(this, code, filename);
};

Module._extensions['.js'] = function(module, filename) {
  console.log("CJS -> _extensions['.js'] called for", filename);
  return originalExtensions.call(this, module, filename);
};
