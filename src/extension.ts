import { triggerRegexHide } from "./utils/triggerRegexHide";
import { ExtensionService } from "./services/ExtensionService";
import * as vscode from "vscode";
import { setComments } from "./utils/setComments";
import { setRegexLines } from "./utils/setRegexLines";
import { triggerCommentsHide } from "./utils/triggerCommentsHide";
import { toggleComments } from "./utils/toggleComments";

export const CONFIG_SECTION = "hideComments";
export const CONFIG_DEFAULT_ENABLED = "defaultEnabled";
export const CONFIG_CLEAN_START = "cleanStart";
export const CONFIG_REGEX = "regex";
export const CONFIG_COLOR = "color";

export const CONFIG_TOKENS = "tokenColorCustomizations";

export const CONTEXT_KEYS = {
  comments: `${CONFIG_SECTION}.commentsEnabled`,
  regex: `${CONFIG_SECTION}.regexEnabled`,
  regexUsed: `${CONFIG_SECTION}.regexUsed`,
};

export const STATE_KEYS = {
  regexEnabled: `${CONFIG_SECTION}.regexEnabled`,
};

export async function activate(context: vscode.ExtensionContext) {
  const ext = ExtensionService.getInstance(context);

  const { subscriptions } = context;

  const config = vscode.workspace.getConfiguration("editor");
  const colors = config.get<any>(CONFIG_TOKENS);

  const extDefaultEnabled = ext.getSetting<boolean>(CONFIG_DEFAULT_ENABLED);
  const extCleanStart = ext.getSetting<boolean>(CONFIG_CLEAN_START);

  // Automatically start when the comments setting is not available
  if (extDefaultEnabled && config && colors && !colors["comments"]) {
    const choice = await vscode.window.showInformationMessage(
      "Do you want to hide comments in this project?",
      "Yes",
      "No"
    );
    if (choice === "Yes") {
      setComments(true);
    } else {
      setComments(false);
    }

    await ext.setState(STATE_KEYS.regexEnabled, choice === "Yes");
    setRegexLines();
  }

  if (extCleanStart) {
    if (config && colors && colors["comments"]) {
      setComments(false);
    }

    await ext.setState(STATE_KEYS.regexEnabled, false);
  }

  const toggleCommentsCmd = vscode.commands.registerCommand(
    "hidecomments.toggle",
    async () => {
      toggleComments();
    }
  );

  const hideCommentsCmd = vscode.commands.registerCommand(
    "hidecomments.hide",
    () => {
      setComments(true);
    }
  );

  const showCommentsCmd = vscode.commands.registerCommand(
    "hidecomments.show",
    () => {
      setComments(false);
    }
  );

  const hideConsoleCmd = vscode.commands.registerCommand(
    "hidecomments.regex.hide",
    async () => {
      await ext.setState(STATE_KEYS.regexEnabled, true);
      setRegexLines();
    }
  );

  const showConsoleCmd = vscode.commands.registerCommand(
    "hidecomments.regex.show",
    async () => {
      await ext.setState(STATE_KEYS.regexEnabled, false);
      setRegexLines();
    }
  );

  // Set the type of action to show on the menu
  triggerCommentsHide(colors && !colors["comments"]);
  triggerRegexHide();

  // Show or hide the regex lines
  setRegexLines();

  vscode.window.onDidChangeActiveTextEditor(
    (e) => {
      setRegexLines();
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration(CONFIG_SECTION)) {
        setRegexLines();
        triggerRegexHide();
      }
    },
    null,
    context.subscriptions
  );

  subscriptions.push(toggleCommentsCmd);
  subscriptions.push(hideCommentsCmd);
  subscriptions.push(showCommentsCmd);
  subscriptions.push(hideConsoleCmd);
  subscriptions.push(showConsoleCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
