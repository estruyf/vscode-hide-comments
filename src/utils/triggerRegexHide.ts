import { commands } from "vscode";
import { CONFIG_REGEX, CONTEXT_KEYS } from "../extension";
import { RegexModel } from "../models/RegexModel";
import { ExtensionService } from "../services/ExtensionService";


export const triggerRegexHide = async () => {
  const ext = ExtensionService.getInstance();
  const regExps = ext.getSetting<RegexModel[]>(CONFIG_REGEX);
  
  await commands.executeCommand('setContext', CONTEXT_KEYS.regex, (regExps && regExps.length > 0));
}