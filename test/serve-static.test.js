const path = require("path");
const { resolveFilePath, securityHeaders } = require("../scripts/serve-static.js");

describe("serve-static security checks", () => {
  const rootDir = path.resolve(__dirname, "..", "dist");

  test("resolves root path to index.html", () => {
    const resolved = resolveFilePath(rootDir, "/");
    expect(resolved).toBe(path.resolve(rootDir, "index.html"));
  });

  test("blocks directory traversal attempts", () => {
    expect(resolveFilePath(rootDir, "/../package.json")).toBeNull();
    expect(resolveFilePath(rootDir, "/..\\..\\secret.txt")).toBeNull();
    expect(resolveFilePath(rootDir, "/%2e%2e/%2e%2e/secret.txt")).toBeNull();
  });

  test("blocks malformed and null-byte request paths", () => {
    expect(resolveFilePath(rootDir, "/%E0%A4%A")).toBeNull();
    expect(resolveFilePath(rootDir, "/index.html\0.js")).toBeNull();
  });

  test("includes secure default headers", () => {
    expect(securityHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(securityHeaders["X-Frame-Options"]).toBe("DENY");
    expect(securityHeaders["Referrer-Policy"]).toBe("no-referrer");
  });
});
