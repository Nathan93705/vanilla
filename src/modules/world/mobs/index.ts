import { Plugin } from "@serenityjs/plugins";

import { GroundMobNavigation } from "./navigation/ground";
import { MOBS } from "./mobs";
import { EntityIdentifier, EntityTrait, EntityType } from "@serenityjs/core";
import { VanillaModule } from "../..";

/**
 * List of traits for this module
 */
const TRAITS: Array<typeof EntityTrait> = [...MOBS, GroundMobNavigation];

class MobsModule extends VanillaModule {
  public readonly name: string = "Mobs";

  public load(plugin: Plugin): void {
    // Register all mob traits
    for (const trait of TRAITS) plugin.entities.registerTrait(trait);

    // List of mobs that have climate variants
    const climateVariantMobs = [
      EntityIdentifier.Cow,
      EntityIdentifier.Chicken,
      EntityIdentifier.Pig,
    ];
    // Create climate variant property for each mob type
    for (const identifier of climateVariantMobs) {
      const type = EntityType.get(identifier);
      if (!type) continue;
      type.createEnumProperty(
        "minecraft:climate_variant",
        ["cold", "temperate", "warm"],
        "temperate",
      );
    }
  }
}

export default new MobsModule();
