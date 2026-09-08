const fs = require("fs");

function copyFileWithStreams(sourcePath, destPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    readStream.on("data", (chunk) => {
      console.log(`Read chunk of ${chunk.length} bytes`);
      writeStream.write(chunk);
    });

    readStream.on("end", () => {
      writeStream.end();
      console.log("Finished reading source file");
    });

    readStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("finish", () => {
      console.log("Finished writing destination file");
      resolve({ sourcePath, destPath });
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = copyFileWithStreams;
