import { existsSync, readFileSync, writeFileSync } from "fs";
import { MODULES } from "./modules";

/** ConfigValidator is a tuple containing a validation function and an error message */
type ConfigValidator<T> = [(v: unknown) => v is T, string];

/** Map JS types to runtime validators */
const validators = {
  //Array Validator
  Array: [(v: unknown): v is unknown[] => Array.isArray(v), "Array"],
  // String Validator
  String: [(v: unknown): v is string => typeof v === "string", "String"],
  // Number Validator
  Number: [(v: unknown): v is number => typeof v === "number", "Number"],
  // Boolean Validator
  Boolean: [(v: unknown): v is boolean => typeof v === "boolean", "Boolean"],
  // Object Validator
  Object: [
    (v: unknown): v is Record<string, unknown> =>
      typeof v === "object" && v !== null && !Array.isArray(v),
    "Object",
  ],
  // Module Array Validator
  moduleArray: [
    (v: unknown): v is string[] =>
      Array.isArray(v) &&
      v.every(
        (item) =>
          typeof item === "string" &&
          MODULES.flatMap((m) => m.name).includes(item),
      ),
    `one of "${MODULES.flatMap((m) => m.name).join('", "')}"`,
  ],
} satisfies Record<string, ConfigValidator<any>>;

/**
 * A configuration property with a validator and a default value
 */
type ConfigProperty<T> = {
  validator: ConfigValidator<T>;
  default: T;
};

/**
 * The schema for the configuration
 */
interface ConfigSchema {
  disabledModules: string[];
}

/**
 * Strongly typed config definition
 */
const CONFIG_PROPERTIES: {
  [K in keyof ConfigSchema]: ConfigProperty<ConfigSchema[K]>;
} = {
  disabledModules: {
    validator: validators.moduleArray,
    default: [],
  },
} as const;

/**
 * Fetch and validate the configuration from a file
 * @param path The path to the configuration file
 * @returns The validated configuration
 */
export function fetchConfig(path: string): ConfigSchema {
  const defaults = getDefaultConfig();

  // If the config file does not exist, create it with the default values
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }

  // Attempt to read and parse the config file
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (e: any) {
    throw new Error(`Failed to parse config at ${path}: ${e.message}`);
  }
  if (typeof json !== "object" || json === null)
    throw new Error("Config file must be a JSON object");

  // Validate the config properties
  const config: Partial<ConfigSchema> = {};
  for (const key of Object.keys(CONFIG_PROPERTIES)) {
    if (!isConfigKey(key)) continue;
    const prop = CONFIG_PROPERTIES[key];
    const value = json[key];

    if (value === undefined) {
      setConfigValue(config, key, prop.default);
      continue;
    }

    const [validatorFunc, validatorMsg] = prop.validator;

    if (!validatorFunc(value))
      throw new Error(`Invalid type for '${key}', expected ${validatorMsg}`);

    setConfigValue(config, key, value);
  }

  // Fill any missing properties and update written file
  const filledConfig = fillDefaults(config, defaults);
  if (filledConfig !== config)
    writeFileSync(path, JSON.stringify(filledConfig, null, 2), "utf-8");

  return filledConfig;
}

/**
 * Get the default configuration
 * @returns The default configuration
 */
export function getDefaultConfig(): ConfigSchema {
  const config = {} as ConfigSchema;

  for (const key in CONFIG_PROPERTIES) {
    if (!isConfigKey(key)) continue;
    setConfigValue(config, key, CONFIG_PROPERTIES[key].default);
  }

  return config;
}

/**
 * Fill in default values for any missing properties in a partial configuration
 * @param partial The partial configuration to fill in
 * @param defaults The default configuration values
 * @returns The filled configuration
 */
function fillDefaults(partial: any, defaults: any): ConfigSchema {
  for (const key in defaults) {
    if (partial[key] === undefined) partial[key] = defaults[key];
    else if (
      typeof partial[key] === "object" &&
      partial[key] !== null &&
      !Array.isArray(partial[key])
    )
      fillDefaults(partial[key], defaults[key]);
  }
  return partial;
}

/**
 * Check if a key is a valid configuration key
 * @param key The key to check
 * @returns True if the key is a valid configuration key, false otherwise
 */
function isConfigKey(key: string): key is keyof ConfigSchema {
  return key in CONFIG_PROPERTIES;
}

/**
 * Set a configuration value
 * @param config The configuration object
 * @param key The key to set
 * @param value The value to set
 */
function setConfigValue<K extends keyof ConfigSchema>(
  config: Partial<ConfigSchema>,
  key: K,
  value: ConfigSchema[K],
) {
  config[key] = value;
}
