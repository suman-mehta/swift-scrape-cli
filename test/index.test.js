import test from "node:test";
import assert from "node:assert/strict";
import { writeFile, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";

const PORT = 34567;
const HOST = "127.0.0.1";

test("CLI parses JSON endpoint", async (t) => {
  const server = createServer((req, res) => {
    if (req.url === "/json") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ hello: "world" }));
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
  server.listen(PORT, HOST);
  await once(server, "listening");

  const url = `http://${HOST}:${PORT}/json`;
  const result = spawnSync("node", ["src/index.js", "--url", url, "--output", "json"], {
    encoding: "utf-8",
  });

  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.deepEqual(parsed, { hello: "world" });

  server.close();
});

test("CLI extracts HTML with selector", async (t) => {
  const html = `<html><body><h1 class="title">Welcome</h1></body></html>`;
  const server = createServer((req, res) => {
    if (req.url === "/html") {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
  server.listen(PORT + 1, HOST);
  await once(server, "listening");

  const url = `http://${HOST}:${PORT + 1}/html`;
  const result = spawnSync(
    "node",
    ["src/index.js", "--url", url, "--output", "text", "--selector", "title"],
    { encoding: "utf-8" }
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "Welcome");

  server.close();
});