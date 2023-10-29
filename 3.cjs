(async () => {
    console.log("CJS -> import('http'):", (await import("node:http")).default);

    console.log("3.cjs done");
})()
