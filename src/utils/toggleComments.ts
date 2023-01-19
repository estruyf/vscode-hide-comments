import { setComments } from './setComments';
import { workspace } from "vscode";
import { CONFIG_TOKENS } from "../extension";


export const toggleComments = async () => {
  const config = workspace.getConfiguration("editor");
	const colors = config.get<any>(CONFIG_TOKENS);

  if (config && colors) {
    let textMateRules: any[] = colors["textMateRules"] || [];
    let commentRuleIdx = textMateRules.findIndex(r => r && r.scope && (r.scope as any[]).includes("comment.line.double-slash") && (r.scope as any[]).includes("hidecomments"));

    if (commentRuleIdx >= 0) {
      setComments(false);
    } else {
      setComments(true);
    }
  }
}