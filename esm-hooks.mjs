import {readFile} from 'node:fs/promises';
import Module from 'node:module';

const [major, minor] = process.versions.node.split('.').map(it => +it);
const isLT16_12 = major < 16 || (major === 16 && minor < 12);

const modulesToPatch = ['node:http'] // for 'http' and other builtins without 'node:' we can just add 'node:' prefix before making decision
const moduleMocks = {
  "http": new URL('./http-mock.mjs', import.meta.url)
}

const globalPreload = !Module.register && function({port}) {
  port.on('message', msg => {
    console.log("ESM HOOK -> GLOBAL PRELOAD -> MESSAGE", msg);
  });
  console.log("ESM HOOK -> GLOBAL PRELOAD");
  port.unref();
  return 'global.__csiPostMessage = d => port.postMessage(d);';
}

const initialize = Module.register && async function(data) {
  if (data?.port) {
    data.port.on('message', msg => {
      console.log("ESM HOOK -> INIT -> MESSAGE", msg);
    });
  }
  console.log("ESM HOOK -> INIT");
}

const resolve = async function(specifier, context, nextResolve) {
  console.log("ESM HOOK -> RESOLVE", specifier);

  const isMockFile = context.parentURL?.endsWith('fake=1') === true;
  // console.log('isMockFile', isMockFile)

  if (!isMockFile && modulesToPatch.includes(specifier)) {
    return {
      url: `${specifier}?fake=1`,
      format: 'module', // sure, we should check packege.json type for non-builtin modules, but it's an example, right?
      shortCircuit: true,
    }
  }

  return protectedNextResolve(nextResolve, specifier, context);
}

const load = async function(url, context, nextLoad) {
  console.log("ESM HOOK -> LOAD", url);

  const urlObject = new URL(url);

  if (urlObject.searchParams.has('fake')) {
    const mockUrl = moduleMocks[urlObject.pathname];
    if (mockUrl !== undefined) {
      const source = await readFile(mockUrl, 'utf8');

      return {
        source,
        shortCircuit: true,
        format: 'module'
      }

    }
  }

  return nextLoad(url, context);
};

async function protectedNextResolve(nextResolve, specifier, context) {
  if (context.parentURL) {
    if (context.conditions.slice(-1)[0] === 'node-addons' || context.importAssertions || isLT16_12) {
      return nextResolve(specifier, context);
    }
  }

  return nextResolve(specifier);
}

const getSource = isLT16_12 && load;

export {
  load,
  resolve,
  getSource,
  initialize,
  globalPreload,
  //loaderIsVerified as default
}
