import { workspace } from "vscode";
import { CONFIG_BACKUP, CONFIG_COLOR, CONFIG_TOKENS } from "../extension";
import { triggerCommentsHide } from "./triggerCommentsHide";
import { ExtensionService } from "../services/ExtensionService";

export const setComments = async (enabled: boolean) => {
  const config = workspace.getConfiguration("editor");
  const colors = config.get<any>(CONFIG_TOKENS);
  const ext = ExtensionService.getInstance();
  const commentColor = ext.getSetting<boolean>(CONFIG_COLOR);
  let backup = ext.getSetting<any>(CONFIG_BACKUP) || {};

  if (config && colors) {
    let textMateRules: any[] = colors["textMateRules"] || [];
    let commentRuleIdx = textMateRules.findIndex(
      (r) =>
        r && r.scope && (r.scope as any[]).includes("comment.line.double-slash")
    );

    if (enabled) {
      if (colors["comments"]) {
        backup["comments"] = colors["comments"];
      }
      if (textMateRules.length > 0) {
        backup["textMateRules"] = textMateRules;
      }

      colors["comments"] = commentColor || "#00000000";

      if (commentRuleIdx >= 0) {
        textMateRules[commentRuleIdx].settings.foreground =
          commentColor || "#00000000";
      } else {
        textMateRules.push({
          scope: [
            "hidecomments",
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
            "comment.block.documentation.cs entity.name.tag.localname.cs",
          ],
          settings: {
            foreground: commentColor || "#00000000",
          },
        });
      }
    } else {
      if (
        !backup?.comments &&
        colors["comments"] &&
        colors["comments"] !== commentColor
      ) {
        backup["comments"] = colors["comments"];
      } else {
        colors["comments"] = backup?.comments || "";
      }

      if (
        backup?.textMateRules &&
        backup.textMateRules &&
        backup.textMateRules?.length > 0
      ) {
        textMateRules = backup["textMateRules"];
      } else if (commentRuleIdx >= 0) {
        textMateRules = textMateRules.filter(
          (r) =>
            r &&
            r.scope &&
            !(r.scope as any[]).includes("comment.line.double-slash")
        );
      }
    }

    colors["[*Light*]"] = undefined;
    colors["[*Dark*]"] = undefined;
    colors["textMateRules"] = textMateRules;

    await config.update(CONFIG_TOKENS, colors);
    await ext.updateSetting(
      CONFIG_BACKUP,
      Object.keys(backup).length > 0 ? backup : undefined
    );

    triggerCommentsHide(colors);
  }
};
