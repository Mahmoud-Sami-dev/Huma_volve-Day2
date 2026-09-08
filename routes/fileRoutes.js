const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const copyFileWithStreams = require("../utils/streamCopy");
const copyFileWithPipe = require("../utils/pipeCopy");
const asyncHandler = require("../utils/asyncHandler");

const SOURCE_FILE = path.join(__dirname, "../test-files/source.txt");
const STREAM_DEST = path.join(__dirname, "../test-files/dest-streams.txt");
const PIPE_DEST = path.join(__dirname, "../test-files/dest-pipe.txt");

function verifyMatch(source, dest) {
  const sourceContent = fs.readFileSync(source, "utf-8");
  const destContent = fs.readFileSync(dest, "utf-8");
  return sourceContent === destContent;
}

router.get("/copy-stream", asyncHandler(async (req, res) => {
  await copyFileWithStreams(SOURCE_FILE, STREAM_DEST);
  const matches = verifyMatch(SOURCE_FILE, STREAM_DEST);

  res.status(200).json({
    success: true,
    method: "manual streams (chunks)",
    destination: STREAM_DEST,
    contentMatches: matches,
  });
}));

router.get("/copy-pipe", asyncHandler(async (req, res) => {
  await copyFileWithPipe(SOURCE_FILE, PIPE_DEST);
  const matches = verifyMatch(SOURCE_FILE, PIPE_DEST);

  res.status(200).json({
    success: true,
    method: ".pipe()",
    destination: PIPE_DEST,
    contentMatches: matches,
  });
}));

module.exports = router;
