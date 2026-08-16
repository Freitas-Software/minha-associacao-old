import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		conditions: ['development'],
	},
	test: {
		coverage: {
			exclude: [
				'src/dev.ts',
				'src/index.ts',
				'src/db/migrate-debug.ts',
				'src/db/ping.ts',
				'src/lib/auth.cli.ts',
				'src/db/schema/**',
			],
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'html'],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
		environment: 'node',
		include: ['test/**/*.test.ts'],
	},
});
