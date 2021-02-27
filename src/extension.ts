// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate({ subscriptions }: vscode.ExtensionContext) {
	
	const config = vscode.workspace.getConfiguration("editor");
	const configSetting = "tokenColorCustomizations";
	const colors = config.get<any>(configSetting);

	const setComments = async (enabled: boolean) => {
		if (config && colors) {
			let textMateRules: any[] = colors["textMateRules"] || [];
			let commentRuleIdx = textMateRules.findIndex(r => r && r.scope && (r.scope as any[]).includes("comment.line.double-slash"));

			if (enabled) {
				colors["comments"] = "#00000000";

				if (commentRuleIdx >= 0) {
					textMateRules[commentRuleIdx].settings.foreground = "#00000000";
				} else {
					textMateRules.push({
						"scope": [
							"comment",
							"comment.block",
							"comment.line",
							"comment.line.double-slash"
						],
						"settings": {
							"foreground": "#00000000"
						}
					});
				}
			} else {
				colors["comments"] = "";

				if (commentRuleIdx >= 0) {
					textMateRules = textMateRules.filter(r => r && r.scope && !(r.scope as any[]).includes("comment.line.double-slash"));
				}
			}

			colors["textMateRules"] = textMateRules;

			await config.update(configSetting, colors);
		}
	}

	// Automatically start when the comments setting is not available
	if (config && colors && !colors["comments"]) {
		var choice = await vscode.window.showInformationMessage("Do you want to hide comments in this project?", "Yes", "No");
		if (choice === "Yes") {
			setComments(true);
		} else {
			setComments(false);
		}
	}

	const hideCommentsCmd = vscode.commands.registerCommand('hidecomments.hide', () => {
		setComments(true);
	});

	const showCommentsCmd = vscode.commands.registerCommand('hidecomments.show', () => {
		setComments(false);
	});

	subscriptions.push(hideCommentsCmd);
	subscriptions.push(showCommentsCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
