// Runs the snapshot tests with every vendored VS Code grammar registered, so
// embedded HTML, CSS, JavaScript, JSON and YAML tokenize the way they do in
// the editor. Extra arguments (for example --updateSnapshot) are passed on.
import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const vendor = join("test", "grammar", "vendor");
const grammarArgs = (await readdir(vendor))
	.filter((file) => file.endsWith(".json"))
	.flatMap((file) => ["-g", join(vendor, file)]);

const result = spawnSync(
	"npx",
	["vscode-tmgrammar-snap", ...grammarArgs, "test/grammar/*.njk", ...process.argv.slice(2)],
	{ stdio: "inherit", shell: process.platform === "win32" },
);
process.exit(result.status ?? 1);
