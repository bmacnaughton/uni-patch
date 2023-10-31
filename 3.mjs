import {createRequire} from 'node:module';

const http = createRequire(import.meta.url)("node:http");
if (http.fake === true) {
  console.log("ESM -> createRequire()('http'): IS MOCKED");
} else {
  console.log("ESM -> createRequire()('http'): IS **NOT** MOCKED");
}

console.log("3.mjs done");
