import {readFile} from 'node:fs/promises';

const modulesToPatch = ['node:http'] // for 'http' and other builtins without 'node:' we can just add 'node:' prefix before making decision
const moduleMocks = {
  "http": new URL('./http-mock.mjs', import.meta.url)
}

//export function globalPreload() {
//  console.log("ESM HOOK -> GLOBAL PRELOAD");
//  return '';
//}

export async function initialize() {
  console.log("ESM HOOK -> INIT");
}

export async function resolve(specifier, context, nextResolve) {
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

  return nextResolve(specifier, context);
}

export const load = async (url, context, nextLoad) => {
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

function protectedNextResolve(nextResolve, specifier, context) {
  if (context.parentURL) {
    if (context.conditions.slice(-1)[0] === 'node-addons' || context.importAssertions || isLT16_12) {
      return nextResolve(specifier, context);
    }
  }

  return nextResolve(specifier);
}
