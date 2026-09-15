// Downloads the VS Code grammars that text.html.nunjucks includes (HTML, CSS,
// JavaScript, YAML) so the grammar tests can tokenize embedded regions the way
// VS Code does. The files are MIT licensed by Microsoft and are not committed.
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const base =
	"https://raw.githubusercontent.com/microsoft/vscode/main/extensions";
// The YAML grammar is split over several files that include each other. If one
// of them is missing, vscode-textmate silently drops the rule that includes
// source.yaml, so all of them are needed.
const grammars = {
	"html.tmLanguage.json": `${base}/html/syntaxes/html.tmLanguage.json`,
	"css.tmLanguage.json": `${base}/css/syntaxes/css.tmLanguage.json`,
	"javascript.tmLanguage.json": `${base}/javascript/syntaxes/JavaScript.tmLanguage.json`,
	"json.tmLanguage.json": `${base}/json/syntaxes/JSON.tmLanguage.json`,
	"yaml.tmLanguage.json": `${base}/yaml/syntaxes/yaml.tmLanguage.json`,
	"yaml-1.0.tmLanguage.json": `${base}/yaml/syntaxes/yaml-1.0.tmLanguage.json`,
	"yaml-1.1.tmLanguage.json": `${base}/yaml/syntaxes/yaml-1.1.tmLanguage.json`,
	"yaml-1.2.tmLanguage.json": `${base}/yaml/syntaxes/yaml-1.2.tmLanguage.json`,
	"yaml-1.3.tmLanguage.json": `${base}/yaml/syntaxes/yaml-1.3.tmLanguage.json`,
	"yaml-embedded.tmLanguage.json": `${base}/yaml/syntaxes/yaml-embedded.tmLanguage.json`,
};

const dir = join("test", "grammar", "vendor");
await mkdir(dir, { recursive: true });

for (const [file, url] of Object.entries(grammars)) {
	const target = join(dir, file);
	try {
		await access(target);
		continue;
	} catch {
		// Missing, fetch it.
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`${url}: ${response.status} ${response.statusText}`);
	}
	await writeFile(target, await response.text());
	console.log(`fetched ${file}`);
}
