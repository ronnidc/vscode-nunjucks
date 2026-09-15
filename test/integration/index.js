// Entry point VS Code loads inside the extension host. CommonJS because the
// extension host requires it.
const path = require("path");
const Mocha = require("mocha");

exports.run = () =>
	new Promise((resolve, reject) => {
		const mocha = new Mocha({ ui: "bdd", timeout: 90000, color: true });
		mocha.addFile(path.join(__dirname, "features.test.js"));
		mocha.run((failures) => {
			if (failures > 0) {
				reject(new Error(`${failures} integration test(s) failed`));
			} else {
				resolve();
			}
		});
	});
