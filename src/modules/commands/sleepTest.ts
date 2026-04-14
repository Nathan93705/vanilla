import { Player, World } from "@serenityjs/core";
import { ActorDataId, DataItem, ActorDataType } from "@serenityjs/protocol";
import { IVanillaCommand } from "../../types";

class TestingCommand implements IVanillaCommand {
  public load(world: World): void {
    world.commandPalette.register(
      "sleeptest",
      "Vanilla sleep test command",
      (ctx) => {
        const { origin } = ctx;
        if (!(origin instanceof Player)) return;

        origin.metadata.setActorMetadata(
          ActorDataId.PlayerFlags,
          ActorDataType.Byte,
          0x2,
        );
      },
    );
  }
}

export default new TestingCommand();
