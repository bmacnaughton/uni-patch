const http = require('node:http');
if (http.fake === true) {
  console.log("CJS -> require('http'): IS MOCKED");
} else {
  console.log("CJS -> require('http'): IS **NOT** MOCKED");
}

console.log("1.cjs done");
