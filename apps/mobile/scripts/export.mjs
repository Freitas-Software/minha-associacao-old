import { spawnSync } from 'node:child_process';

const expoCommand = process.platform === 'win32' ? 'expo.cmd' : 'expo';
const result = spawnSync(expoCommand, ['export', '--platform', 'all', '--output-dir', 'dist'], {
	env: {
		...process.env,
		EXPO_NO_TELEMETRY: '1',
	},
	stdio: 'inherit',
});

if (result.error) {
	throw result.error;
}

process.exit(result.status ?? 1);
