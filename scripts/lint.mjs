// Structural checks that vsce does not do: every JSON file the manifest points
// at parses, every #include in the grammars resolves, and the snippets file
// only uses prefixes once.
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
let failures = 0;

function fail(message) {
	failures += 1;
	console.error(`lint: ${message}`);
}

async function readJson(path) {
	try {
		return JSON.parse(await readFile(path, "utf8"));
	} catch (error) {
		fail(`${path}: ${error.message}`);
		return undefined;
	}
}

for (const language of manifest.contributes.languages) {
	await readJson(language.configuration);
}

for (const grammar of manifest.contributes.grammars) {
	const json = await readJson(grammar.path);
	if (!json) {
		continue;
	}
	if (json.scopeName !== grammar.scopeName) {
		fail(`${grammar.path}: scopeName ${json.scopeName} does not match manifest ${grammar.scopeName}`);
	}
	const repository = json.repository ?? {};
	const references = new Set();
	JSON.stringify(json, (key, value) => {
		if (key === "include" && typeof value === "string" && value.startsWith("#")) {
			references.add(value.slice(1));
		}
		return value;
	});
	for (const reference of references) {
		if (!(reference in repository)) {
			fail(`${grammar.path}: #${reference} is included but not defined in repository`);
		}
	}
	for (const name of Object.keys(repository)) {
		if (!references.has(name)) {
			fail(`${grammar.path}: repository entry ${name} is never included`);
		}
	}
}

for (const snippetFile of manifest.contributes.snippets) {
	const snippets = await readJson(snippetFile.path);
	if (!snippets) {
		continue;
	}
	const prefixes = new Map();
	for (const [name, snippet] of Object.entries(snippets)) {
		for (const prefix of [].concat(snippet.prefix)) {
			if (prefixes.has(prefix)) {
				fail(`${snippetFile.path}: prefix ${prefix} used by both ${prefixes.get(prefix)} and ${name}`);
			}
			prefixes.set(prefix, name);
		}
		if (!snippet.body || !snippet.description) {
			fail(`${snippetFile.path}: ${name} needs body and description`);
		}
	}
}

if (failures > 0) {
	process.exit(1);
}
console.log("lint: ok");
