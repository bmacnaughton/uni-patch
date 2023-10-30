(async () => {
  const http = (await import("node:http")).default;
    if (http.fake === true) {
      console.log("CJS -> import('http'): IS MOCKED");
    } else {
      console.log("CJS -> import('http'): IS **NOT** MOCKED");
    }

    console.log("3.cjs done");
})()
