// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	const config = vscode.workspace.getConfiguration("editor");
	const configSetting = "tokenColorCustomizations";
	const colors = config.get<any>(configSetting);
	if (config && colors) {
		var choice = await vscode.window.showInformationMessage("Do you want to hide comments?", "Yes", "No");
		if (choice === "Yes") {
			colors["comments"] = "#00000000";
		} else {
			colors["comments"] = null;
		}
		await config.update(configSetting, colors);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
