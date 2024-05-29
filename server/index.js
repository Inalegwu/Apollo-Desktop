console.log("Launching transfer server");

process.parentPort.on("message", (e) => {
  console.log(e);
});
