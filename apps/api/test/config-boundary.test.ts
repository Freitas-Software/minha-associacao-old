import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const apiDirectory = new URL('../', import.meta.url);

describe('configuration boundary', () => {
	it('keeps direct environment access inside @minha-associacao/config', async () => {
		const sourceDirectory = new URL('src/', apiDirectory);
		const sourceEntries = await readdir(sourceDirectory, { recursive: true, withFileTypes: true });
		const sourceFiles = sourceEntries
			.filter(entry => entry.isFile() && entry.name.endsWith('.ts'))
			.map(entry => pathToFileURL(path.join(entry.parentPath, entry.name)));
		const files = [new URL('drizzle.config.ts', apiDirectory), ...sourceFiles];
		const offenders: string[] = [];

		for (const file of files) {
			const source = await readFile(file, 'utf8');
			if (/process\s*\.\s*env/u.test(source)) {
				offenders.push(file.pathname.slice(apiDirectory.pathname.length));
			}
		}

		expect(offenders).toEqual([]);
	});
});
