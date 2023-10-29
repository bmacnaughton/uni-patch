import {createRequire} from 'node:module';

console.log("ESM -> createRequire()('http'):", createRequire(import.meta.url)("node:http"));

console.log("3.mjs done");