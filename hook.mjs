export async function resolve(specifier, context, nextResolve) {
  console.log("ESM HOOK -> RESOLVE", specifier);
  return nextResolve(specifier, context);
}

export const load = async (url, context, nextLoad) => {
  console.log("ESM HOOK -> LOAD", url);

  if (url === 'node:http') {
    return {
      source: 'export default {fake: true, source: "esm hook"}',
      shortCircuit: true,
      format: 'module'
    }
  }
 
  return nextLoad(url, context);
};
