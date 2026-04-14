import { join } from "path";

import { Plugin } from "@serenityjs/plugins";

import { MODULES } from "./modules";
import { fetchConfig } from "./config";

class VanillaPlugin extends Plugin {
  public constructor() {
    super("vanilla-plugin", "1.0.0");
  }

  public onInitialize(): void {
    const configPath = join(this.path, "../configs/vanilla.json");

    // Get the plugin configuration.
    const configuration = fetchConfig(configPath);
    const disabledModules = new Set(configuration.disabledModules);

    // Load all modules that are not disabled.
    for (const module of MODULES) {
      // Check if the module is disabled.
      if (disabledModules.has(module.name)) continue;

      module.load(this);
      this.logger.info(`Loaded module [${module.name}]`);
    }
  }
}

export default new VanillaPlugin();
