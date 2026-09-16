// End-to-end checks of the editing features the extension promises, run in a
// real VS Code. Each test maps to an issue that was open before 1.0.
const assert = require("assert");
const path = require("path");
const vscode = require("vscode");

const examples = path.resolve(__dirname, "..", "..", "examples");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function poll(check, timeout = 30000, interval = 250) {
	const deadline = Date.now() + timeout;
	let last;
	while (Date.now() < deadline) {
		last = await check();
		if (last) {
			return last;
		}
		await sleep(interval);
	}
	throw new Error("timed out waiting for condition");
}

async function openNunjucks(content) {
	const document = await vscode.workspace.openTextDocument({ language: "nunjucks", content });
	const editor = await vscode.window.showTextDocument(document);
	return { document, editor };
}

function placeCursor(editor, line, character) {
	const position = new vscode.Position(line, character);
	editor.selection = new vscode.Selection(position, position);
}

async function type(text) {
	for (const char of text) {
		await vscode.commands.executeCommand("type", { text: char });
	}
}

async function completionsAt(document, position) {
	return vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, position);
}

describe("Nunjucks language support", function () {
	before(async () => {
		// The HTML language server needs a moment after the first Nunjucks
		// document opens. Wait until it answers with HTML tag completions.
		const { document } = await openNunjucks("<di");
		await poll(async () => {
			const list = await completionsAt(document, new vscode.Position(0, 3));
			return list && list.items.some((item) => item.label === "div");
		});
		const html = vscode.extensions.getExtension("vscode.html-language-features");
		assert.ok(html?.isActive, "opening a Nunjucks file should have activated the HTML language features");
	});

	afterEach(async () => {
		await vscode.commands.executeCommand("workbench.action.closeAllEditors");
	});

	it("associates .njk files with the nunjucks language", async () => {
		const document = await vscode.workspace.openTextDocument(path.join(examples, "post.njk"));
		assert.strictEqual(document.languageId, "nunjucks");
	});

	it("offers HTML tag completion (#3)", async () => {
		const { document } = await openNunjucks("<p>\n<di");
		const list = await completionsAt(document, new vscode.Position(1, 3));
		assert.ok(list.items.some((item) => item.label === "div"), "expected div in completions");
	});

	it("offers HTML attribute completion inside a tag that also holds Nunjucks (#23)", async () => {
		const { document } = await openNunjucks('<a {% if x %}hidden{% endif %} hr');
		const list = await completionsAt(document, new vscode.Position(0, 34));
		assert.ok(list.items.some((item) => item.label === "href"), "expected href in completions");
	});

	it("offers Nunjucks snippets", async () => {
		const { document } = await openNunjucks("fo");
		// Snippet completions are contributed lazily, so retry for a while.
		await poll(async () => {
			const list = await completionsAt(document, new vscode.Position(0, 2));
			return list.items.some(
				(item) => item.kind === vscode.CompletionItemKind.Snippet && (item.label.label ?? item.label) === "for",
			);
		}, 10000);
	});

	it("auto-closes HTML tags (#3)", async () => {
		const { document, editor } = await openNunjucks("");
		placeCursor(editor, 0, 0);
		await type("<div>");
		await poll(async () => document.getText() === "<div></div>", 10000);
	});

	it("auto-closes Nunjucks delimiters", async () => {
		const { document, editor } = await openNunjucks("");
		placeCursor(editor, 0, 0);
		await type("{{");
		assert.strictEqual(document.getText(), "{{ }}");
		assert.strictEqual(editor.selection.active.character, 2);
		await type(" a");
		assert.strictEqual(document.getText(), "{{ a }}");
	});

	it("auto-closes tag delimiters", async () => {
		const { document, editor } = await openNunjucks("");
		placeCursor(editor, 0, 0);
		await type("{%");
		assert.strictEqual(document.getText(), "{% %}");
	});

	// Comment style follows the token at the cursor, so the document must have
	// been tokenized first. Tokenization is asynchronous and there is no API
	// to wait for it, hence the fixed delay. VS Code also loads the language
	// configuration (and so the comment markers) of an embedded language
	// lazily, and in this fresh test window nothing has loaded JavaScript or
	// CSS yet (plain HTML behaves the same here), so open one of each first.
	async function toggleLineCommentUntil(document, editor, line, expected) {
		await vscode.workspace.openTextDocument({ language: "javascript", content: "" });
		await vscode.workspace.openTextDocument({ language: "css", content: "" });
		await sleep(3000);
		placeCursor(editor, line, 0);
		await vscode.commands.executeCommand("editor.action.commentLine");
		assert.strictEqual(document.lineAt(line).text, expected);
	}

	it("toggles Nunjucks comments in markup (#8)", async () => {
		const { document, editor } = await openNunjucks("<p>hello</p>\n");
		await toggleLineCommentUntil(document, editor, 0, "{# <p>hello</p> #}");
	});

	it("toggles JavaScript comments inside script blocks (#11)", async () => {
		const { document, editor } = await openNunjucks("<script>\nconst a = 1;\n</script>\n");
		await toggleLineCommentUntil(document, editor, 1, "// const a = 1;");
	});

	it("toggles CSS comments inside style blocks (#18)", async () => {
		const { document, editor } = await openNunjucks("<style>\n.a { color: red; }\n</style>\n");
		await toggleLineCommentUntil(document, editor, 1, "/* .a { color: red; } */");
	});

	it("indents on Enter between HTML tags (#27)", async () => {
		const { document, editor } = await openNunjucks("<div></div>");
		placeCursor(editor, 0, 5);
		await type("\n");
		assert.deepStrictEqual(
			document.getText().split("\n").map((line) => line.replace(/\s+$/, "")),
			["<div>", "", "</div>"],
		);
		assert.strictEqual(editor.selection.active.line, 1);
		assert.ok(editor.selection.active.character > 0, "expected an indented cursor");
	});

	it("indents on Enter between Nunjucks block tags (#27)", async () => {
		const { document, editor } = await openNunjucks("{% if x %}{% endif %}");
		placeCursor(editor, 0, 10);
		await type("\n");
		assert.deepStrictEqual(
			document.getText().split("\n").map((line) => line.replace(/\s+$/, "")),
			["{% if x %}", "", "{% endif %}"],
		);
		assert.strictEqual(editor.selection.active.line, 1);
		assert.ok(editor.selection.active.character > 0, "expected an indented cursor");
	});

	it("indents on Enter between Eleventy's setAsync tags (#45)", async () => {
		const { document, editor } = await openNunjucks('{% setAsync "x" %}{% endsetAsync %}');
		placeCursor(editor, 0, 18);
		await type("\n");
		assert.deepStrictEqual(
			document.getText().split("\n").map((line) => line.replace(/\s+$/, "")),
			['{% setAsync "x" %}', "", "{% endsetAsync %}"],
		);
		assert.strictEqual(editor.selection.active.line, 1);
		assert.ok(editor.selection.active.character > 0, "expected an indented cursor");
	});

	it("keeps template tags and comments intact when formatting (#12)", async () => {
		const { document, editor } = await openNunjucks(
			"{% extends 'base.njk' %}\n{# a comment\n   over two lines #}\n{% block content %}\n<ul>\n<li>{{ item }}</li>\n</ul>\n{% endblock %}\n",
		);
		await poll(async () => {
			const edits = await vscode.commands.executeCommand("vscode.executeFormatDocumentProvider", document.uri, {
				tabSize: 2,
				insertSpaces: true,
			});
			return edits && edits.length > 0;
		});
		await vscode.commands.executeCommand("editor.action.formatDocument");
		const text = document.getText();
		assert.ok(text.includes("{% extends 'base.njk' %}\n{# a comment\n   over two lines #}\n{% block content %}"), text);
		assert.match(text, /<ul>\n\s+<li>\{\{ item \}\}<\/li>\n<\/ul>/);
		assert.strictEqual(editor.document.getText(), text);
	});

	it("expands Emmet abbreviations (#7)", async () => {
		const { document, editor } = await openNunjucks("ul>li*2");
		placeCursor(editor, 0, 7);
		await vscode.commands.executeCommand("editor.emmet.action.expandAbbreviation");
		await poll(async () => document.getText().includes("<ul>"), 10000);
		assert.match(document.getText(), /^<ul>\n\s+<li><\/li>\n\s+<li><\/li>\n<\/ul>$/);
	});

	it("provides document symbols for the HTML structure", async () => {
		const { document } = await openNunjucks("<main>\n<section id=\"a\"></section>\n</main>");
		const symbols = await poll(async () => {
			const result = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
			return result && result.length > 0 ? result : undefined;
		});
		assert.ok(symbols.some((symbol) => symbol.name === "main"), "expected a main symbol");
	});
});
