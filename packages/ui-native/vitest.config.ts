import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		conditions: ['development'],
	},
	test: {
		coverage: {
			exclude: ['src/index.ts'],
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'html'],
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90,
			},
		},
		environment: 'node',
		include: ['test/**/*.test.ts'],
	},
});
