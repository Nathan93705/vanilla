import { IVanillaCommand } from "../../types";

import TestingCommand from "./testing";
import { WorldInitializeSignal } from "@serenityjs/core";
import { VanillaModule } from "..";
import sleepTest from "./sleepTest";

/**
 * The list of all vanilla commands.
 */
const COMMANDS: Array<IVanillaCommand> = [TestingCommand, sleepTest];

/**
 * The vanilla commands module.
 */
class CommandsModule extends VanillaModule {
  public readonly name: string = "command";

  /**
   * Handles the WorldInitialize event.
   * @param event The WorldInitialize event.
   */
  public onWorldInitialize(event: WorldInitializeSignal): void {
    for (const command of COMMANDS) command.load(event.world);
  }
}

export default new CommandsModule();
