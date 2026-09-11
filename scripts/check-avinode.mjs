#!/usr/bin/env node
/**
 * One-shot Avinode connectivity check. Run it anywhere with network access:
 *
 *   npm run avinode:check
 *
 * Reads credentials from .env.local (or the ambient environment), makes one
 * real POST /searches, and prints exactly what came back. Token values are
 * never printed — only whether they were found and how long they are.
 */
import { readFileSync } from "node:fs";

/** Minimal .env parser — avoids a dependency for a one-file script. */
function loadEnvLocal() {
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
    console.log("Loaded .env.local");
  } catch {
    console.log("No .env.local found — using the ambient environment");
  }
}

loadEnvLocal();

const baseUrl = process.env.AVINODE_API_BASE_URL ?? "https://sandbox.avinode.com/api";
const apiToken = process.env.AVINODE_API_TOKEN;
const authToken = process.env.AVINODE_AUTH_TOKEN;
const apiVersion = process.env.AVINODE_API_VERSION ?? "v1";
const product = process.env.AVINODE_PRODUCT ?? "exjet-charter-landing/1.0";

const show = (v) => (v ? `found (${v.length} chars)` : "MISSING");
console.log(`\nBase URL            ${baseUrl}`);
console.log(`AVINODE_API_TOKEN   ${show(apiToken)}`);
console.log(`AVINODE_AUTH_TOKEN  ${show(authToken)}`);
console.log(`AVINODE_API_VERSION ${apiVersion}`);
console.log(`AVINODE_PRODUCT     ${product}`);

if (!apiToken || !authToken) {
  console.log("\nRESULT: credentials missing. Copy .env.example to .env.local and fill both tokens.");
  process.exit(1);
}

const body = {
  segments: [{
    startAirport: { icao: "EGGW" },
    endAirport: { icao: "LFMN" },
    dateTime: { date: "2026-12-01", time: "10:00", departure: true, local: true },
    paxCount: 4,
  }],
};

console.log(`\nPOST ${baseUrl}/searches`);
console.log(`body ${JSON.stringify(body)}\n`);

try {
  const response = await fetch(`${baseUrl}/searches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "X-Avinode-ApiToken": apiToken,
      "X-Avinode-ApiVersion": apiVersion,
      "X-Avinode-Product": product,
      "X-Avinode-SentTimestamp": `${new Date().toISOString().slice(0, 16)}Z`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  console.log(`HTTP ${response.status} ${response.statusText}`);
  console.log(`content-type: ${response.headers.get("content-type") ?? "(none)"}\n`);
  console.log(text.slice(0, 4000));

  // A corporate proxy or sandbox can answer instead of Avinode. Saying
  // "Avinode rejected it" in that case sends you debugging the wrong thing.
  const fromProxy = /not in allowlist|egress|proxy/i.test(text);

  if (response.ok) {
    console.log("\nRESULT: Avinode accepted the call. Paste the body above and the parser can be matched to it.");
  } else if (fromProxy) {
    console.log(`\nRESULT: a network proxy answered ${response.status}, not Avinode — this request never left your network.`);
    console.log("Nothing is wrong with the credentials or the code; the host is blocked where you ran this.");
  } else if (response.status === 401 || response.status === 403) {
    console.log(`\nRESULT: Avinode refused the credentials (${response.status}).`);
    console.log("Check the tokens, and that the integration is provisioned for end-client search rather than B2B.");
  } else {
    console.log(`\nRESULT: Avinode rejected the call with ${response.status}. The body above says why.`);
  }
} catch (error) {
  console.log(`RESULT: could not reach ${baseUrl} — ${error.message}`);
  console.log("If this says fetch failed or ENOTFOUND, it is a network/DNS problem, not a credential one.");
}
