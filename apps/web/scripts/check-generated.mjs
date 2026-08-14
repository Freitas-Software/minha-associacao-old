import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const workspaceDirectory = new URL('../', import.meta.url);
const generatedFile = new URL('../src/routeTree.gen.ts', import.meta.url);

async function readGeneratedFile() {
	try {
		return await readFile(generatedFile);
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			return undefined;
		}

		throw error;
	}
}

const before = await readGeneratedFile();
const viteCommand = process.platform === 'win32' ? 'vite.cmd' : 'vite';
const build = spawnSync(viteCommand, ['build', '--logLevel', 'error'], {
	cwd: workspaceDirectory,
	stdio: 'inherit',
});

if (build.error) {
	throw build.error;
}

if (build.status !== 0) {
	process.exit(build.status ?? 1);
}

const after = await readGeneratedFile();

if (before === undefined || after === undefined || !before.equals(after)) {
	console.error('Generated route tree was stale. Review and commit src/routeTree.gen.ts.');
	process.exit(1);
}
