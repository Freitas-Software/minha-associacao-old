export const lightSurfaceColors = {
	surfaceDisabled: 'rgba(15, 23, 42, 0.12)',
	onSurfaceDisabled: 'rgba(15, 23, 42, 0.38)',

	surfaceDim: '#e2e8f0',
	surfaceBright: '#ffffff',

	surfaceContainerLowest: '#ffffff',
	surfaceContainerLow: '#f8fafc',
	surfaceContainer: '#f1f5f9',
	surfaceContainerHigh: '#e2e8f0',
	surfaceContainerHighest: '#cbd5e1',

	shadow: '#000000',
	backdrop: 'rgba(2, 6, 23, 0.4)',

	elevation: {
		level0: 'transparent',
		level1: '#f8fafc',
		level2: '#f1f5f9',
		level3: '#e2e8f0',
		level4: '#dbe3ed',
		level5: '#cbd5e1',
	},
} as const;

export const darkSurfaceColors = {
	surfaceDisabled: 'rgba(248, 250, 252, 0.12)',
	onSurfaceDisabled: 'rgba(248, 250, 252, 0.38)',

	surfaceDim: '#020617',
	surfaceBright: '#334155',

	surfaceContainerLowest: '#020617',
	surfaceContainerLow: '#0f172a',
	surfaceContainer: '#1e293b',
	surfaceContainerHigh: '#334155',
	surfaceContainerHighest: '#475569',

	shadow: '#000000',
	backdrop: 'rgba(0, 0, 0, 0.6)',

	elevation: {
		level0: 'transparent',
		level1: '#0f172a',
		level2: '#172033',
		level3: '#1e293b',
		level4: '#293548',
		level5: '#334155',
	},
} as const;
