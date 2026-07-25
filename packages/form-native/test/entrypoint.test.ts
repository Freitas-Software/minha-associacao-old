import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '..');

interface PackageJson {
	exports: {
		'.': Record<string, string>;
	};
	files: string[];
	main: string;
	'react-native'?: string;
	types: string;
}

describe('@minha-associacao/form-native entrypoint', () => {
	it('exposes compiled production entrypoints and a source development entrypoint', async () => {
		const packageJson = JSON.parse(
			await readFile(resolve(packageRoot, 'package.json'), 'utf8')
		) as PackageJson;

		expect(packageJson.main).toBe('./dist/index.js');
		expect(packageJson.types).toBe('./dist/index.d.ts');
		expect(packageJson['react-native']).toBe('./dist/index.js');

		expect(packageJson.exports['.']).toEqual({
			types: './dist/index.d.ts',
			'react-native': './dist/index.js',
			development: './src/index.ts',
			import: './dist/index.js',
			default: './dist/index.js',
		});
	});

	it('declares the expected public source exports', async () => {
		const entrypoint = await readFile(resolve(packageRoot, 'src/index.ts'), 'utf8');

		expect(entrypoint).toContain('useAppForm');
		expect(entrypoint).toContain('withForm');
		expect(entrypoint).toContain('setServerErrors');
		expect(entrypoint).toContain('FormTextFieldProps');
		expect(entrypoint).toContain('SubmitButtonProps');
		expect(entrypoint).toContain('ResetButtonProps');
		expect(entrypoint).toContain('ErrorSummaryProps');
		expect(entrypoint).toContain('FormProps');
	});
});
