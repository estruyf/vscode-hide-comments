import { setComments } from "./setComments";
import { workspace } from "vscode";
import { CONFIG_COMBINE_TOGGLE, CONFIG_TOKENS, STATE_KEYS } from "../extension";
import { ExtensionService } from "../services/ExtensionService";
import { setRegexLines } from "./setRegexLines";

export const toggleComments = async () => {
  const config = workspace.getConfiguration("editor");
  const colors = config.get<any>(CONFIG_TOKENS);

  if (config && colors) {
    let textMateRules: any[] = colors["textMateRules"] || [];
    let commentRuleIdx = textMateRules.findIndex(
      (r) =>
        r &&
        r.scope &&
        (r.scope as any[]).includes("comment.line.double-slash") &&
        (r.scope as any[]).includes("hidecomments")
    );

    const enabled = commentRuleIdx >= 0;
    setComments(!enabled);

    const commentsEnabled = ExtensionService.getInstance().getSetting<boolean>(
      CONFIG_COMBINE_TOGGLE
    );
    if (commentsEnabled) {
      await ExtensionService.getInstance().setState(
        STATE_KEYS.regexEnabled,
        !enabled
      );
      setRegexLines();
    }
  }
};
