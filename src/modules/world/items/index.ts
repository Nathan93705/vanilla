import { Plugin } from "@serenityjs/plugins";

import { ItemStackTrait } from "@serenityjs/core";
import { VanillaModule } from "../..";

/**
 * List of traits for this module
 */
const TRAITS: Array<typeof ItemStackTrait> = [];

class ItemsModule extends VanillaModule {
  public readonly name = "Items";

  public load(plugin: Plugin): void {
    for (const trait of TRAITS) plugin.items.registerTrait(trait);
  }
}

export default new ItemsModule();
