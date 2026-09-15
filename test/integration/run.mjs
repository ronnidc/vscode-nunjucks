// Downloads a VS Code build (cached under .vscode-test) and runs the
// integration suite inside it with this extension loaded and all other
// third-party extensions disabled, so only built-in extensions take part.
import { runTests } from "@vscode/test-electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

// Terminals spawned by Electron apps (VS Code, Claude Code) export this, and
// it makes the downloaded VS Code run as plain Node instead of as an editor.
delete process.env.ELECTRON_RUN_AS_NODE;

try {
	await runTests({
		extensionDevelopmentPath: root,
		extensionTestsPath: path.join(root, "test", "integration", "index.js"),
		launchArgs: [
			path.join(root, "examples"),
			"--disable-extensions",
			"--disable-workspace-trust",
		],
	});
} catch (error) {
	console.error(error);
	process.exit(1);
}
