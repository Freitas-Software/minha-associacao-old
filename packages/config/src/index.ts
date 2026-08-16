import { Config } from './config.js';
import { type Environment, parseEnv } from './loaders/index.js';

export { Config } from './config.js';

export function createConfig(environment?: Environment): Config {
	return new Config(parseEnv(environment));
}
