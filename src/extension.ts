import * as vscode from 'vscode';

const CONFIG_SECTION = "hideComments";
const CONFIG_DEFAULT_ENABLED = "defaultEnabled";
const CONFIG_CLEAN_START = "cleanStart";
const CONFIG_TOKENS = "tokenColorCustomizations";

export async function activate({ subscriptions }: vscode.ExtensionContext) {
	
	const config = vscode.workspace.getConfiguration("editor");
	const colors = config.get<any>(CONFIG_TOKENS);

	const extConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const extDefaultEnabled = extConfig.get<boolean>(CONFIG_DEFAULT_ENABLED);
	const extCleanStart = extConfig.get<boolean>(CONFIG_CLEAN_START);

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

			await config.update(CONFIG_TOKENS, colors);
		}
	};

	// Automatically start when the comments setting is not available
	if (extDefaultEnabled && config && colors && !colors["comments"]) {
		const choice = await vscode.window.showInformationMessage("Do you want to hide comments in this project?", "Yes", "No");
		if (choice === "Yes") {
			setComments(true);
		} else {
			setComments(false);
		}
	}

	if (extCleanStart && config && colors && colors["comments"]) {
		setComments(false);
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
