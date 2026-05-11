const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/app.log");

const log = (message) => {
  const entry = `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFile(logFilePath, entry, (err) => {
    if (err) {
      console.error("Logging error:", err);
    }
  });
};

module.exports = log;
