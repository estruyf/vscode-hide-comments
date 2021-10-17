import * as vscode from 'vscode';

const CONFIG_SECTION = "hideComments";
const CONFIG_DEFAULT_ENABLED = "defaultEnabled";
const CONFIG_CLEAN_START = "cleanStart";
const CONFIG_TOKENS = "tokenColorCustomizations";

const trigger = async (enabled: boolean) => {
	await vscode.commands.executeCommand('setContext', "hideCommentsEnabled", enabled);

	// Folding
	if (!enabled) {
		await vscode.commands.executeCommand('editor.foldAllBlockComments');
	} else {
		await vscode.commands.executeCommand('editor.unfoldAll');
	}
}

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
							"comment.line.double-slash",
							"variable.other.jsdoc",
							"storage.type.class.jsdoc",
							"punctuation.definition.block.tag.jsdoc",
							"punctuation.definition.bracket.curly.begin.jsdoc",
							"punctuation.definition.bracket.curly.end.jsdoc",
							"entity.name.type.instance.jsdoc",
							"comment.block.documentation.ts",
							"comment.block.documentation.js",
							"comment.block.documentation.cs",
							"comment.block.documentation.cs entity.other.attribute-name.localname.cs",
							"comment.block.documentation.cs entity.other.attribute-name.cs",
							"comment.block.documentation.cs punctuation.definition.tag.cs",
							"comment.block.documentation.cs punctuation.definition.string.begin.cs",
							"comment.block.documentation.cs punctuation.definition.string.end.cs",
							"comment.block.documentation.cs punctuation.definition.bracket.curly.begin.cs",
							"comment.block.documentation.cs punctuation.definition.bracket.curly.end.cs",
							"comment.block.documentation.cs punctuation.definition.block.tag.cs",
							"comment.block.documentation.cs string.quoted.double.cs",
							"comment.block.documentation.cs entity.name.tag.localname.cs"
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

			trigger(colors && !colors["comments"]);
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

	// Set the type of action to show on the menu
	trigger(colors && !colors["comments"]);

	subscriptions.push(hideCommentsCmd);
	subscriptions.push(showCommentsCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
