
import Module from 'node:module';
import { pathToFileURL } from 'node:url';

//
// in all cases:
// --require === --require ./hook.cjs
// --loader === --loader ./esm-loader.mjs
// --import === --import ./esm-loader.mjs
//
// node version | cmdline            | results
// ------------ | ------------------ | -------
// 18.18.2      | --loader           | ALL MOCKED
// 20.1.0       | --require --loader | ALL MOCKED
// 20.8.1       | --import           | ALL MOCKED
// -------------------------------------------
// 18.18.2      | --import
//              | --require --import
//   - ESM import from 'node:http' NOT MOCKED
//   - CJS import('http') NOT MOCKED
//   - ESM import('http') NOT MOCKED
// -------------------------------------------
// 20.1.0       | --loader
//   - CJS require() NOT MOCKED
//   - CJS createRequire() NOT MOCKED
//   - ESM createRequire() NOT MOCKED

// -------------------------------------------
// 20.8.1       | --loader
//   - CJS require() NOT MOCKED
//   - CJS createRequire() NOT MOCKED
//   - ESM createRequire() NOT MOCKED
// -------------------------------------------




if (!process.execArgv.includes('--require')) {
  //
  // setup CJS hooks
  //
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
}

//
// setup ESM hooks
//
if (Module.register) {
  Module.register(pathToFileURL("./esm-hooks.mjs"));
}

import * as hooks from './esm-hooks.mjs';
const finalHooks = Module.register ? {} : hooks;
const { load, resolve, getSource, initialize, globalPreload } = finalHooks;
export { load, resolve, getSource, initialize, globalPreload };
