const fs = require("fs");
const path = require("path");

exports.streamSong = (req, res) => {
  const fileName = req.params.id;
  const filePath = path.join(__dirname, "..", "uploads", fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
  const chunkSize = end - start + 1;
  res.writeHead(206, {"Content-Type": "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": chunkSize});

  fs.createReadStream(filePath, { start, end }).pipe(res);
};
