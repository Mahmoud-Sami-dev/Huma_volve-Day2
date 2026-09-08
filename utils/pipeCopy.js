const fs = require("fs");

function copyFileWithPipe(sourcePath, destPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    readStream.pipe(writeStream);

    readStream.on("error", (err) => reject(err));
    writeStream.on("error", (err) => reject(err));

    writeStream.on("finish", () => {
      console.log("Pipe copy finished successfully");
      resolve({ sourcePath, destPath });
    });
  });
}

module.exports = copyFileWithPipe;
