import { ExtensionContext, workspace } from "vscode";
import { CONFIG_SECTION } from "../extension";

export class ExtensionService {
  private static instance: ExtensionService;

  private constructor(private ctx: ExtensionContext) {}

  /**
   * Creates the singleton instance for the extension
   * @param ctx
   */
  public static getInstance(ctx?: ExtensionContext): ExtensionService {
    if (!ExtensionService.instance && ctx) {
      ExtensionService.instance = new ExtensionService(ctx);
    }

    return ExtensionService.instance;
  }

  /**
   * Get state
   * @param propKey
   * @param type
   * @returns
   */
  public async getState<T>(
    propKey: string,
    type: "workspace" | "global" = "global"
  ): Promise<T | undefined> {
    if (type === "global") {
      return await this.ctx.globalState.get(propKey);
    } else {
      return await this.ctx.workspaceState.get(propKey);
    }
  }

  /**
   * Store value in the state
   * @param propKey
   * @param propValue
   * @param type
   */
  public async setState<T>(
    propKey: string,
    propValue: T,
    type: "workspace" | "global" = "global"
  ): Promise<void> {
    if (type === "global") {
      await this.ctx.globalState.update(propKey, propValue);
    } else {
      await this.ctx.workspaceState.update(propKey, propValue);
    }
  }

  /**
   * Get a config setting
   * @param key
   * @returns
   */
  public getSetting<T>(key: string): T | undefined {
    const extConfig = workspace.getConfiguration(CONFIG_SECTION);
    return extConfig.get<T>(key);
  }

  /**
   * Update a config setting
   * @param key
   * @param value
   * @returns
   */
  public updateSetting<T>(key: string, value: T) {
    const extConfig = workspace.getConfiguration(CONFIG_SECTION);
    return extConfig.update(key, value);
  }
}
