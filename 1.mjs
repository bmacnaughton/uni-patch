import http from 'node:http';

if (http.fake === true) {
  console.log("ESM -> import from 'http': IS MOCKED");
} else {
  console.log("ESM -> import from 'http': IS **NOT** MOCKED");
}

console.log("1.mjs done");
