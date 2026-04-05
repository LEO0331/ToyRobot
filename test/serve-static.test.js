const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const {
  createStaticServer,
  resolveFilePath,
  securityHeaders,
  startServerFromCli,
} = require("../scripts/serve-static.js");

describe("serve-static security checks", () => {
  const rootDir = path.resolve(__dirname, "..", "dist");

  test("resolves root path to index.html", () => {
    const resolved = resolveFilePath(rootDir, "/");
    expect(resolved).toBe(path.resolve(rootDir, "index.html"));
    expect(resolveFilePath(rootDir)).toBe(path.resolve(rootDir, "index.html"));
  });

  test("blocks directory traversal attempts", () => {
    expect(resolveFilePath(rootDir, "/../package.json")).toBeNull();
    expect(resolveFilePath(rootDir, "/..\\..\\secret.txt")).toBeNull();
    expect(resolveFilePath(rootDir, "/%2e%2e/%2e%2e/secret.txt")).toBeNull();
    expect(resolveFilePath(rootDir, "/C:/Windows/system32")).toBeNull();
  });

  test("blocks malformed and null-byte request paths", () => {
    expect(resolveFilePath(rootDir, 123)).toBeNull();
    expect(resolveFilePath(rootDir, "/%E0%A4%A")).toBeNull();
    expect(resolveFilePath(rootDir, "/index.html\0.js")).toBeNull();
  });

  test("includes secure default headers", () => {
    expect(securityHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(securityHeaders["X-Frame-Options"]).toBe("DENY");
    expect(securityHeaders["Referrer-Policy"]).toBe("no-referrer");
  });
});

describe("serve-static integration", () => {
  let tempRoot;
  let server;
  let port;

  function request({ method = "GET", pathname = "/" }) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path: pathname,
          method,
        },
        (response) => {
          let data = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => {
            data += chunk;
          });
          response.on("end", () => {
            resolve({
              statusCode: response.statusCode,
              headers: response.headers,
              body: data,
            });
          });
        },
      );

      req.on("error", reject);
      req.end();
    });
  }

  beforeAll(async () => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "toyrobot-static-"));
    fs.writeFileSync(path.join(tempRoot, "index.html"), "<h1>Toy Robot</h1>");
    fs.writeFileSync(path.join(tempRoot, "app.js"), "console.log('ok');");
    fs.writeFileSync(path.join(tempRoot, "blob.bin"), "bin-data");
    fs.mkdirSync(path.join(tempRoot, "assets"), { recursive: true });

    server = createStaticServer(tempRoot);
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (tempRoot) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test("serves index and security headers for GET /", async () => {
    const res = await request({ pathname: "/" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("Toy Robot");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["referrer-policy"]).toBe("no-referrer");
    expect(res.headers["content-type"]).toContain("text/html");
  });

  test("serves JS content type correctly", async () => {
    const res = await request({ pathname: "/app.js" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/javascript");
    expect(res.body).toContain("console.log");
  });

  test("falls back to octet-stream content type for unknown extension", async () => {
    const res = await request({ pathname: "/blob.bin" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("application/octet-stream");
    expect(res.body).toContain("bin-data");
  });

  test("returns empty body for HEAD request", async () => {
    const res = await request({ method: "HEAD", pathname: "/" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("");
    expect(res.headers["content-type"]).toContain("text/html");
  });

  test("returns 404 for missing files", async () => {
    const res = await request({ pathname: "/missing-file.txt" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Not Found");
  });

  test("returns 404 for directory paths (not a file)", async () => {
    const res = await request({ pathname: "/assets" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Not Found");
  });

  test("returns 403 for traversal attempts", async () => {
    const res = await request({ pathname: "/%2e%2e/%2e%2e/secret.txt" });
    expect(res.statusCode).toBe(403);
    expect(res.body).toBe("Forbidden");
  });

  test("returns 405 for unsupported methods", async () => {
    const res = await request({ method: "POST", pathname: "/" });
    expect(res.statusCode).toBe(405);
    expect(res.headers.allow).toBe("GET, HEAD");
    expect(res.body).toBe("Method Not Allowed");
  });

  test("bootstraps from cli helper", async () => {
    const messages = [];
    const cliServer = startServerFromCli(
      ["node", "serve-static.js", tempRoot],
      { PORT: "0" },
      (msg) => messages.push(msg),
    );

    await new Promise((resolve) => cliServer.on("listening", resolve));
    expect(messages.some((msg) => msg.includes("Serving"))).toBe(true);
    expect(messages.some((msg) => msg.includes(tempRoot))).toBe(true);

    await new Promise((resolve) => cliServer.close(resolve));
  });

  test("uses default logger parameter in cli helper", async () => {
    const cliServer = startServerFromCli(
      ["node", "serve-static.js", tempRoot],
      { PORT: "0" },
    );

    await new Promise((resolve) => cliServer.on("listening", resolve));
    await new Promise((resolve) => cliServer.close(resolve));
  });

  test("uses default argv parameter in cli helper", async () => {
    const originalArgv = process.argv;
    const originalCwd = process.cwd();
    const tempCwd = fs.mkdtempSync(path.join(os.tmpdir(), "toyrobot-cli-default-"));
    const distDir = path.join(tempCwd, "dist");
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(distDir, "index.html"), "<h1>Argv Default</h1>");

    try {
      process.argv = ["node", "serve-static.js"];
      process.chdir(tempCwd);

      const cliServer = startServerFromCli(undefined, { PORT: "0" }, () => {});
      await new Promise((resolve) => cliServer.on("listening", resolve));
      await new Promise((resolve) => cliServer.close(resolve));
    } finally {
      process.chdir(originalCwd);
      process.argv = originalArgv;
      fs.rmSync(tempCwd, { recursive: true, force: true });
    }
  });

  test("uses default env parameter in cli helper", async () => {
    const originalPort = process.env.PORT;
    process.env.PORT = "0";
    try {
      const cliServer = startServerFromCli(
        ["node", "serve-static.js", tempRoot],
        undefined,
        () => {},
      );

      await new Promise((resolve) => cliServer.on("listening", resolve));
      await new Promise((resolve) => cliServer.close(resolve));
    } finally {
      if (originalPort === undefined) {
        delete process.env.PORT;
      } else {
        process.env.PORT = originalPort;
      }
    }
  });

  test("bootstraps using default dist folder when argv path is omitted", async () => {
    const originalCwd = process.cwd();
    const tempCwd = fs.mkdtempSync(path.join(os.tmpdir(), "toyrobot-cli-cwd-"));
    const distDir = path.join(tempCwd, "dist");
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(distDir, "index.html"), "<h1>Default Dist</h1>");

    const messages = [];

    try {
      process.chdir(tempCwd);
      const cliServer = startServerFromCli(
        ["node", "serve-static.js"],
        { PORT: "0" },
        (msg) => messages.push(msg),
      );
      await new Promise((resolve) => cliServer.on("listening", resolve));

      expect(messages.some((msg) => msg.includes("Serving"))).toBe(true);
      expect(messages.some((msg) => msg.includes(distDir))).toBe(true);

      await new Promise((resolve) => cliServer.close(resolve));
    } finally {
      process.chdir(originalCwd);
      fs.rmSync(tempCwd, { recursive: true, force: true });
    }
  });

  test("falls back to '/' when request url is missing", async () => {
    const emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "toyrobot-url-fallback-"));
    const localServer = createStaticServer(emptyRoot);

    const writeHead = jest.fn();
    const end = jest.fn();
    const mockResponse = { writeHead, end };

    try {
      localServer.emit("request", { method: "GET" }, mockResponse);
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(writeHead).toHaveBeenCalled();
      expect(end).toHaveBeenCalledWith("Not Found");
    } finally {
      fs.rmSync(emptyRoot, { recursive: true, force: true });
    }
  });
});
