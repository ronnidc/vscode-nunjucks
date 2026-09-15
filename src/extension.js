// The built-in HTML language server only activates for html and handlebars
// documents, so the htmlLanguageParticipants contribution in package.json has
// no effect until something wakes it up. This is that something. Plain
// CommonJS so the same file serves as both the node and the web entry point.
const vscode = require("vscode");

exports.activate = async () => {
	await vscode.extensions.getExtension("vscode.html-language-features")?.activate();
};
