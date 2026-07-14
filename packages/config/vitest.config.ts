import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			exclude: ['src/index.ts', 'src/loaders/index.ts'],
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
