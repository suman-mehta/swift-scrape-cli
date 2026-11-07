#!/usr/bin/env node
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import { URL } from "node:url";
import { promisify } from "node:util";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { url: null, output: "text", selector: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--url" && i + 1 < args.length) {
      options.url = args[++i];
    } else if (a === "--output" && i + 1 < args.length) {
      options.output = args[++i];
    } else if (a === "--selector" && i + 1 < args.length) {
      options.selector = args[++i];
    }
  }
  if (!options.url) {
    console.error("Error: --url is required");
    process.exit(1);
  }
  return options;
}

function fetchData(target) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(target);
    const lib = urlObj.protocol === "https:" ? httpsRequest : httpRequest;
    const req = lib(urlObj, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString();
        resolve({ body, contentType: res.headers["content-type"] || "" });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function extractFromHTML(html, selector) {
  if (!selector) return html;
  const regex = new RegExp(`<[^>]*${selector}[^>]*>(.*?)<\\/[^>]+>`, "is");
  const match = html.match(regex);
  return match ? match[1].trim() : "";
}

function serialize(data, format) {
  if (format === "json") {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }
  if (format === "csv") {
    const lines = data.split("
").map((l) => `"${l.replace(/"/g, '""')}"`);
    return lines.join("
");
  }
  return data;
}

async function main() {
  const opts = parseArgs();
  const { body, contentType } = await fetchData(opts.url);
  let payload = body;
  if (contentType.includes("text/html")) {
    payload = extractFromHTML(body, opts.selector);
  }
  const output = serialize(payload, opts.output);
  process.stdout.write(output);
  process.exit(0);
}

await main();