const fs = require("fs");
const http = require("http");
const path = require("path");

const mimeType = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const securityHeaders = {
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function setHeaders(response, status, extraHeaders = {}) {
  response.writeHead(status, {
    ...securityHeaders,
    ...extraHeaders,
  });
}

function resolveFilePath(rootDir, requestUrl = "/") {
  if (typeof requestUrl !== "string" || requestUrl.includes("\0")) {
    return null;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requestUrl);
  } catch (error) {
    return null;
  }

  const urlPath = decodedPath.split("?")[0].split("#")[0];
  const normalizedPath =
    urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const safePath = path.normalize(normalizedPath);
  const absoluteRoot = path.resolve(rootDir);
  const absolutePath = path.resolve(absoluteRoot, safePath);
  const hasWindowsDrivePrefix = /^[a-zA-Z]:[\\/]/.test(safePath);

  if (
    safePath.startsWith("..") ||
    hasWindowsDrivePrefix ||
    path.isAbsolute(safePath) ||
    (!absolutePath.startsWith(`${absoluteRoot}${path.sep}`) &&
      absolutePath !== absoluteRoot)
  ) {
    return null;
  }

  return absolutePath;
}

function sendFile(filePath, requestMethod, response) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeType[ext] || "application/octet-stream";
  const cacheControl =
    ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable";
  setHeaders(response, 200, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
  });

  if (requestMethod === "HEAD") {
    response.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.pipe(response);
}

function createStaticServer(rootDir) {
  return http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      setHeaders(response, 405, { Allow: "GET, HEAD" });
      response.end("Method Not Allowed");
      return;
    }

    const filePath = resolveFilePath(rootDir, request.url || "/");

    if (!filePath) {
      setHeaders(response, 403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        setHeaders(response, 404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not Found");
        return;
      }

      sendFile(filePath, request.method, response);
    });
  });
}

function startServerFromCli(
  argv = process.argv,
  env = process.env,
  logger = console.log,
) {
  const rootDir = path.resolve(process.cwd(), argv[2] || "dist");
  const port = Number(env.PORT || 8080);
  const server = createStaticServer(rootDir);

  server.listen(port, () => {
    logger(`Serving ${rootDir} at http://localhost:${port}`);
  });

  return server;
}

/* istanbul ignore next */
if (require.main === module) {
  startServerFromCli();
}

module.exports = {
  createStaticServer,
  resolveFilePath,
  securityHeaders,
  startServerFromCli,
};
