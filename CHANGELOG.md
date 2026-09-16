# Changelog

All notable changes to the Nunjucks extension are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.1] - 2026-09-16

Eleventy support. Everything Eleventy adds on top of Nunjucks now gets the same editor behaviour as Nunjucks' own syntax.

### Added

- Eleventy's `{% setAsync %}`, its paired core shortcodes (`renderTemplate`, `css`, `js`, `html`) and the `{% switch %}` tag fold and indent like Nunjucks block tags, and `setAsync` and `switch` are highlighted as keywords (#45).
- CSS, JavaScript and Markdown highlighting inside `{% css %}`, `{% js %}` and `{% renderTemplate "md" %}`, with Nunjucks still highlighted and comment toggling following the embedded language (#46).
- Eleventy's universal filters (`url`, `slugify`, `log`, `getCollectionItem` and friends, `inputPathToUrl`, `renderTransforms`, `renderContent`) are coloured like Nunjucks' built-in filters (#47).
- Snippets for `setAsync`, `switch`, the Render and Bundle plugin shortcodes, generic shortcodes and YAML, `---js` and `---json` front matter (#48).

### Changed

- The README screenshot is taken in VS Code's default Dark Modern theme, so it shows the colours a new install gets.

## [1.0.0] - 2026-09-15

A rewrite. The original grammar was a port of a Django grammar with a copy of an old HTML grammar inside it, which is what broke HTML IntelliSense and most of the other things reported over the years. Version 1.0.0 replaces it with a Nunjucks grammar injected into VS Code's own HTML grammar and hooks the extension into VS Code's HTML language server.

### Added

- HTML IntelliSense in Nunjucks files: tag and attribute completion, hover, auto-closing and auto-renaming of tags, matching tag highlighting, document symbols and folding, plus CSS and JavaScript features inside `<style>` and `<script>` (#3, #10, #18, #37).
- Emmet enabled for Nunjucks files by default (#7).
- Formatting through VS Code's HTML formatter with `html.format.templating` on by default, so `{% %}`, `{{ }}` and `{# #}` survive Format Document (#12, #15).
- Highlighting of Nunjucks inside attribute values, `<script>`, `<style>` and inline styles (#23, #37).
- YAML, `---js` and `---json` front matter highlighting (#29).
- `{% raw %}` and `{% verbatim %}` blocks are no longer parsed as Nunjucks.
- Whitespace control (`{%-`, `-%}`, `{{-`, `-}}`), tests (`is defined`), regular expression literals, dict and list literals, all built-in filters, tests and globals, and custom tags such as Eleventy shortcodes.
- Auto-closing pairs for `{{ }}`, `{% %}` and `{# #}`, bracket matching for `{% %}` and `{{ }}`.
- Indentation rules and on-Enter rules for Nunjucks block tags (#27).
- Snippets for every Nunjucks tag, including `asyncEach`, `asyncAll`, `call`, `setblock`, `import`, `from`, `raw` and `verbatim`.
- Snapshot tests for the grammar and integration tests that run the editing features in a real VS Code, both run in GitHub Actions.
- Published to Open VSX for VSCodium and other editors (#28, #32).
- MIT license (#14, #33).

### Changed

- Comment toggling follows the language at the cursor: `{# #}` in markup, `//` in scripts, `/* */` in styles (#8, #11, #30).
- Escaped quotes inside strings no longer break highlighting (#21).
- Hyphenated tag names such as `<my-element>` are highlighted as a whole (#17).
- Minimum VS Code version is 1.70.
- The old Django-only tag and filter names (`csrf_token`, `blocktrans`, `addslashes` and friends) are gone.

### Removed

- The manual installation guide and the extension quickstart from `docs/`.

## [0.3.1] - 2022-03-09

- Stopped claiming `.html`, `.tpl` and other generic extensions, which had hijacked comment toggling and IntelliSense in plain HTML files (#11, #13, #30).

## [0.3.0] - 2020-05-05

- Snippets for `block`, `extends`, `include`, `filter`, `for`, `if`, `macro` and comments.
- Quotes surround selected text.
- New logo.

## [0.2.3] - 2016-08-03

- `.njk` file extension (#5).

## [0.1.0] - 2015-12-04

- First release: syntax highlighting ported from Sublime-nunjucks.

[1.0.1]: https://github.com/ronnidc/vscode-nunjucks/releases/tag/v1.0.1
[1.0.0]: https://github.com/ronnidc/vscode-nunjucks/releases/tag/v1.0.0
[0.3.1]: https://github.com/ronnidc/vscode-nunjucks/compare/0b37788...2c1d203
[0.3.0]: https://github.com/ronnidc/vscode-nunjucks/commit/5d98a65
[0.2.3]: https://github.com/ronnidc/vscode-nunjucks/commit/ba3207d
[0.1.0]: https://github.com/ronnidc/vscode-nunjucks/commit/2cd2835
