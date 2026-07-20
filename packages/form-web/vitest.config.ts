import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			exclude: ['src/index.ts', 'src/form-hook.ts'],
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			provider: 'v8',
			reporter: ['text', 'json-summary', 'html'],
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90,
			},
		},
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				pretendToBeVisual: true,
			},
		},
		include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
	},
});
