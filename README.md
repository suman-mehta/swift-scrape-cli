# swift‑scrape‑cli

**Lightning‑fast, zero‑dependency data parsing, serialization & scraping**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Node.js >=20](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen.svg)](https://nodejs.org/) [![Version](https://img.shields.io/badge/Version-1.0.0-lightgrey.svg)](https://github.com/yourname/swift-scrape-cli) [![Stars](https://img.shields.io/github/stars/yourname/swift-scrape-cli.svg)](https://github.com/yourname/swift-scrape-cli/stargazers) [![Issues](https://img.shields.io/github/issues/yourname/swift-scrape-cli.svg)](https://github.com/yourname/swift-scrape-cli/issues)

---

## Installation & Quick Start

```bash
# Clone the repository
git clone https://github.com/yourname/swift-scrape-cli.git
cd swift-scrape-cli

# Run the CLI directly with Node
node src/index.js --url https://api.example.com/data --output json
```

The command above fetches the remote JSON payload and pretty‑prints it to the console.

---

## Features

- **Zero external dependencies** – pure Node.js built‑ins only.
- Supports **HTTP and HTTPS** out of the box.
- Optional **HTML selector extraction** for quick scraping.
- Flexible output formats: `text` (default), `json`, `csv`.
- Single‑file executable, ideal for CI/CD and lightweight containers.

---

## Usage

```bash
swift-scrape --url <URL> [--output <format>] [--selector <css‑like>]
```

| Option | Description |
|--------|-------------|
| `--url` | Target HTTP(S) endpoint (required). |
| `--output` | `text` (default), `json`, or `csv`. |
| `--selector` | Simple string that appears in an HTML tag to extract inner text. Ignored for non‑HTML responses. |

---

## Architecture Flowchart

```mermaid
flowchart TD
    A["Start CLI"] --> B["Parse arguments"]
    B --> C["Fetch data (HTTP/HTTPS)"]
    C --> D{"Content‑Type?"}
    D -->|HTML| E["Extract via selector"]
    D -->|JSON| F["Parse JSON"]
    E --> G["Serialize (json/csv/text)"]
    F --> G
    G --> H["Write to stdout"]
    H --> I["process.exit(0)"]
```

---

## Test Results

## 🧪 Real-World Test Telemetry

> [!NOTE]
> Verified automatically using Node.js native test runner (`node:test` & `node:assert/strict`).

```bash
▶ node --test
TAP version 13
# Subtest: CLI parses JSON endpoint
not ok 1 - CLI parses JSON endpoint
  ---
  duration_ms: 4.303546
  location: './test/index.test.js:11:1'
  failureType: 'testCodeFailure'
  error: 'listen EADDRINUSE: address already in use 127.0.0.1:34567'
  code: 'EADDRINUSE'
  stack: |-
    Server.setupListenHandle [as _listen2] (node:net:1908:16)
    listenInCluster (node:net:1965:12)
    doListen (node:net:2139:7)
    process.processTicksAndRejections (node:internal/process/task_queues:83:21)
  ...
# Subtest: CLI extracts HTML with selector
not ok 2 - CLI extracts HTML with selector
  ---
  duration_ms: 1.018568
  location: './test/index.test.js:36:1'
  failureType: 'testCodeFailure'
  error: 'listen EADDRINUSE: address already in use 127.0.0.1:34568'
  code: 'EADDRINUSE'
  stack: |-
    Server.setupListenHandle [as _listen2] (node:net:1908:16)
    listenInCluster (node:net:1965:12)
    doListen (node:net:2139:7)
    process.processTicksAndRejections (node:internal/process/task_queues:83:21)
  ...
1..2
# tests 2
# suites 0
# pass 0
# fail 2
# cancelled 0
# skipped 0
# todo 0
# duration_ms 55.064539
```

---

## License

MIT © 2026 Suman Mehta