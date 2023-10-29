const {createRequire} = require('node:module');
console.log("CJS -> reqcreateRequire()('http'):", createRequire(__filename)("node:http"));

console.log("2.cjs done");