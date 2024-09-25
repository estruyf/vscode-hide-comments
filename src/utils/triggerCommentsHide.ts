import { commands } from "vscode";
import { CONFIG_COLOR, CONFIG_FOLD_ON_HIDE, CONTEXT_KEYS } from "../extension";
import { ExtensionService } from "../services/ExtensionService";

export const triggerCommentsHide = async (colors: any) => {
  const ext = ExtensionService.getInstance();
  const colorConfig = ext.getSetting<boolean>(CONFIG_COLOR);
  const enabled =
    colors &&
    (!colors["comments"] ||
      (colors["comments"] && colors["comments"] !== colorConfig));

  await commands.executeCommand("setContext", CONTEXT_KEYS.comments, enabled);

  const foldOnHide =
    ExtensionService.getInstance().getSetting<boolean>(CONFIG_FOLD_ON_HIDE);

  if (foldOnHide) {
    // Folding
    if (!enabled) {
      await commands.executeCommand("editor.foldAllBlockComments");
    } else {
      await commands.executeCommand("editor.unfoldAll");
    }
  }
};
