import { describe, expect, it } from 'vitest';
import * as configPackage from '../src/index.js';

describe('config package entrypoint', () => {
	it('exposes only the configuration object and its factory', () => {
		expect(Object.keys(configPackage).sort()).toEqual(['Config', 'createConfig']);
	});
});
