import { World } from "@serenityjs/core";

/**
 * Interface for a vanilla command.
 */
interface IVanillaCommand {
  /**
   * Loads the command.
   * @param world The world instance to load the command into.
   */
  load(world: World): void;
}

export { IVanillaCommand };
