import { commands, DecorationOptions, Range, window } from "vscode";
import { CONFIG_REGEX, CONTEXT_KEYS, STATE_KEYS } from "../extension";
import { RegexModel } from "../models/RegexModel";
import { ExtensionService } from "../services/ExtensionService";

const consoleTextDecoration = window.createTextEditorDecorationType({
  textDecoration: "none; visibility: hidden",
});

export const setRegexLines = async () => {
  const ext = ExtensionService.getInstance();
  const isRegExEnabled = await ext.getState<boolean>(STATE_KEYS.regexEnabled);
  const regExps = ext.getSetting<RegexModel[]>(CONFIG_REGEX);
  
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const document = editor.document;
  const text = document.getText();

  const decorators: DecorationOptions[] = [];

  if (regExps && regExps.length > 0) {
    for (const regExp of regExps) {
      if (!regExp.regex) {
        continue;
      }

      const crntRegEx = RegExp(regExp.regex, regExp.flags || "igm");

      if (isRegExEnabled) {
        let match;
        while (match = crntRegEx.exec(text)) {
          const matched = match[0];

          if (!matched) {
            continue;
          }

          const startIndex = match[0].indexOf(matched);
          const startIdx = document.positionAt(match.index + startIndex);
          const endIdx = document.positionAt(match.index + startIndex + matched.length);
          const range = new Range(startIdx, endIdx);

          decorators.push({ range });
        }
      }
    }
  }

  editor.setDecorations(
    consoleTextDecoration,
    decorators
  );

  await commands.executeCommand('setContext', CONTEXT_KEYS.regexUsed, !isRegExEnabled);
}