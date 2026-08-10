import { readFileSync } from "node:fs";

const workflowPath = process.argv[2] ?? ".github/workflows/greetings.yml";
const source = readFileSync(workflowPath, "utf8");
const lines = source.split(/\r?\n/);
const onIndex = lines.indexOf("on:");

if (onIndex === -1) {
  console.error(
    'greetings workflow event contract FAILED: missing top-level "on" block',
  );
  process.exit(1);
}

/** @type {Record<string, string[]>} */
const events = {};
/** @type {string | undefined} */
let currentEvent;

for (const line of lines.slice(onIndex + 1)) {
  if (line && !line.startsWith(" ")) break;

  const eventMatch = /^  ([a-z_]+):\s*$/.exec(line);
  const eventName = eventMatch?.[1];
  if (eventName) {
    currentEvent = eventName;
    events[currentEvent] = [];
  } else {
    const typesMatch = /^    types:\s*\[([^\]]*)\]\s*$/.exec(line);
    const typeList = typesMatch?.[1];
    if (typeList !== undefined && currentEvent) {
      events[currentEvent] = typeList
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean);
    }
  }
}

const expected = {
  issues: ["opened"],
  pull_request_target: ["opened"],
};

if (JSON.stringify(events) !== JSON.stringify(expected)) {
  console.error("greetings workflow event contract FAILED");
  console.error(`expected: ${JSON.stringify(expected)}`);
  console.error(`received: ${JSON.stringify(events)}`);
  process.exit(1);
}

console.log(
  "greetings workflow event contract passed (issues=opened, pull_request_target=opened)",
);
