#vscode-nunjucks
A Nunjucks syntax definition specifically for **VS Code**.

## Install your extension manually
To start using this extension with Visual Studio Code you need to proceed with theese four simple steps:

1. Navigate to the `<user home>/.vscode/extensions` directory on your computer.
2. Create a new folder and name it `nunjucks`
3. Copy all content of this repository into the `<user home>/.vscode/extensions/nunjucks` directory (you may skip the image folder if you prefer).
4. Restart the Code app and you are all set up for start writing Nunjucks templates in Code.

![Nunjucks example i Code](images/vscode-nunjucks.png)

## What's in the folder
* This folder contains all of the files necessary for the vscode-nunjucks extension
* `package.json` - this is the manifest file in which the language support is declared and the location of the grammar file that has been copied into the extension is defined.
* `syntaxes/nunjucks.tmLanguage` - this is the Text mate grammar file that is used for tokenization
* `nunjucks.configuration.json` - this the language configuration, defining the tokens that are used for comments and brackets.

### For more information
* [Visual Studio Code Docs](https://code.visualstudio.com/docs)
* [Nunjucks by Mozilla](https://mozilla.github.io/nunjucks/)

### Credits
Based on [Sublime-nunjucks](https://github.com/mogga/sublime-nunjucks)