# Contributing

Thanks for helping out. Bug reports with a minimal template that shows the problem are the most useful thing you can send. Pull requests are welcome too, small and focused ones get merged fastest.

## How the extension is built

There is no build step. Everything the extension does is declared in `package.json` and a few JSON files:

| File | What it does |
| --- | --- |
| `syntaxes/nunjucks.tmLanguage.json` | The `text.html.nunjucks` grammar. It only handles front matter and then includes VS Code's own HTML grammar. |
| `syntaxes/nunjucks-injection.tmLanguage.json` | All Nunjucks constructs. It is injected into every scope of the main grammar, which is why `{{ }}` works inside attributes, scripts and styles. |
| `language-configuration.json` | Comments, brackets, auto-closing pairs, indentation and on-Enter rules. |
| `snippets/nunjucks.json` | The snippets. |
| `src/extension.js` | A few lines that activate VS Code's HTML language server for Nunjucks files. The `htmlLanguageParticipants` entry in `package.json` tells that server to treat Nunjucks as HTML. |

## Running it locally

Node 22 or newer is required for the scripts and tests, `.nvmrc` names the version CI uses.

```
git clone https://github.com/ronnidc/vscode-nunjucks
cd vscode-nunjucks
npm install
```

Open the folder in VS Code and press F5 (Run Extension). A second VS Code window opens with the extension loaded and the `examples/` folder as workspace.

## Tests

```
npm run lint            # JSON sanity checks and the list of files vsce would package
npm run test:grammar    # tokenizes test/grammar/*.njk and compares with the .snap files
npm run test:integration  # downloads VS Code once and runs test/integration in it
npm test                # all of the above
```

When you change the grammar, run `npm run test:grammar:update`, then read the diff of the `.snap` files carefully before committing: the snapshot is the specification. Add a line to the relevant `test/grammar/*.njk` file for every construct you fix, ideally taken from the issue you are fixing.

The integration tests type into a real editor and check what VS Code does with it, so they are the place to prove that comment toggling, indentation, Emmet, formatting and completion still work.

## Releasing

Releases are cut by pushing a tag: bump `version` in `package.json`, add a section to `CHANGELOG.md`, commit, tag it `vX.Y.Z` and push the tag. The release workflow packages the extension, publishes it to the Visual Studio Marketplace and Open VSX, and attaches the `.vsix` to a GitHub release.
