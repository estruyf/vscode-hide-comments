import { commands } from "vscode";
import { CONTEXT_KEYS } from "../extension";


export const triggerCommentsHide = async (enabled: boolean) => {
	await commands.executeCommand('setContext', CONTEXT_KEYS.comments, enabled);

	// Folding
	if (!enabled) {
		await commands.executeCommand('editor.foldAllBlockComments');
	} else {
		await commands.executeCommand('editor.unfoldAll');
	}
}