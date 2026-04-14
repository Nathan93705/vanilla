import { Plugin } from "@serenityjs/plugins";

import { EnchantingTableTrait } from "./enchanting-table";
import { VanillaModule } from "../..";
import { BlockTrait } from "@serenityjs/core";

/**
 * List of traits for this module
 */
const TRAITS: Array<typeof BlockTrait> = [EnchantingTableTrait];

class BlocksModule extends VanillaModule {
  public readonly name: string = "Blocks";

  public load(plugin: Plugin): void {
    for (const trait of TRAITS) plugin.blocks.registerTrait(trait);
  }
}

export default new BlocksModule();
