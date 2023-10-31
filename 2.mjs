const http = (await import("node:http")).default;
if (http.fake === true) {
  console.log("ESM -> import('http'): IS MOCKED");
} else {
  console.log("ESM -> import('http'): IS **NOT** MOCKED");
}

console.log("2.mjs done");
