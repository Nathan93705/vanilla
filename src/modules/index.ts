import blocks from "./world/blocks";
import mobs from "./world/mobs";
import commands from "./commands";
import items from "./world/items";
import { Plugin } from "@serenityjs/plugins";
import { WorldEvent, WorldInitializeSignal } from "@serenityjs/core";

/**
 * Represents a vanilla module that can be loaded into a plugin.
 */
export abstract class VanillaModule {
  /** The name of the module. */
  abstract readonly name: string;

  /**
   * Loads the module into the given plugin.
   * @param plugin The plugin instance to load the module into.
   */
  public load(plugin: Plugin) {
    plugin.serenity.on(
      WorldEvent.WorldInitialize,
      this.onWorldInitialize.bind(this),
    );
  }

  /**
   * Called when the world is initialized.
   * @param world The world initialization signal.
   */
  public onWorldInitialize(_world: WorldInitializeSignal) {}
}

/**
 * List of all available modules.
 */
const MODULES: Array<VanillaModule> = [blocks, mobs, commands, items];

export { MODULES };
