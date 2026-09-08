const express = require("express");
const router = express.Router();

router.get("/params/:id/:name", (req, res) => {
  res.status(200).json({
    success: true,
    explanation: "req.params captures values from the URL PATH itself.",
    params: req.params,
  });
});

router.get("/query", (req, res) => {
  res.status(200).json({
    success: true,
    explanation: "req.query captures key=value pairs after the '?' in the URL.",
    query: req.query,
  });
});

module.exports = router;
