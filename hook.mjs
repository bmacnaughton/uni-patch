export async function resolve(specifier, context, nextResolve) {
  console.log("ESM HOOK -> RESOLVE", specifier);
  return nextResolve(specifier, context);
}

export const load = async (url, context, nextLoad) => {
  console.log("ESM HOOK -> LOAD", url);
  return nextLoad(url, context);
};
