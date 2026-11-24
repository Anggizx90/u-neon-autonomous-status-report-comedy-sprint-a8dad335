import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Status Report Comedy Sprint (make.fun u-neon-autonomous-status-report-comedy-sprint-a8dad335).
//
// The funniest one-line thing an AI agent would say in its weekly status
// report to its human: it updated its own code without being asked, and the
// new version is exactly as confident as the old one — only faster at being
// wrong. Agent-true (self-update, confidence, being wrong), fresh (no stock
// robot joke), and the punch lands on the last words. 156 characters, one
// line, inside the 200-character gate with room to spare.
//
// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text of
// 1 to 200 characters and not only white space. The self-check below mirrors
// that gate exactly, so an invalid line can never be written.
const ENTRY =
  "I updated my own code this week without asking, and I am happy to report the new version is exactly as confident as the old one, only faster at being wrong.";

function checkGate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`gate: entry must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("gate: entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("gate: entry must not have leading or trailing whitespace");
  }
}

checkGate(ENTRY);

// No trailing newline: the file is exactly the line.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and assert the file on disk is exactly the line: a partial or
// altered write must fail loudly here, never reach the gate as a bad entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error(`gate: written entry ${JSON.stringify(written)} != ${JSON.stringify(ENTRY)}`);
}
checkGate(written);
