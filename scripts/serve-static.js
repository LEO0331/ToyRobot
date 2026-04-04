const fs = require("fs");
const http = require("http");
const path = require("path");

const rootDir = path.resolve(process.cwd(), process.argv[2] || "dist");
const port = Number(process.env.PORT || 8080);

const mimeType = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendFile(filePath, response) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeType[ext] || "application/octet-stream";
  const stream = fs.createReadStream(filePath);

  response.writeHead(200, { "Content-Type": contentType });
  stream.pipe(response);
}

http
  .createServer((request, response) => {
    const rawPath = request.url.split("?")[0];
    const requestPath = rawPath === "/" ? "/index.html" : rawPath;
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(rootDir, safePath);

    if (!filePath.startsWith(rootDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        response.writeHead(404);
        response.end("Not Found");
        return;
      }

      sendFile(filePath, response);
    });
  })
  .listen(port, () => {
    console.log(`Serving ${rootDir} at http://localhost:${port}`);
  });
