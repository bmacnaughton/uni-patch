const {createRequire} = require('node:module');

const http = createRequire(__filename)("node:http");
if (http.fake === true) {
  console.log("CJS -> createRequire('http'): IS MOCKED");
} else {
  console.log("CJS -> createRequire('http'): IS **NOT** MOCKED");
}

console.log("2.cjs done");
