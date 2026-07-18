import type { SemanticColors } from './types.js';

export const darkColors: SemanticColors = {
	primary: '#93c5fd',
	onPrimary: '#172554',
	primaryContainer: '#1e3a8a',
	onPrimaryContainer: '#dbeafe',

	secondary: '#cbd5e1',
	onSecondary: '#0f172a',
	secondaryContainer: '#334155',
	onSecondaryContainer: '#f8fafc',

	tertiary: '#c4b5fd',
	onTertiary: '#2e1065',
	tertiaryContainer: '#5b21b6',
	onTertiaryContainer: '#ede9fe',

	error: '#fca5a5',
	onError: '#450a0a',
	errorContainer: '#7f1d1d',
	onErrorContainer: '#fee2e2',

	background: '#020617',
	onBackground: '#f8fafc',

	surface: '#020617',
	onSurface: '#f8fafc',

	surfaceVariant: '#1e293b',
	onSurfaceVariant: '#cbd5e1',

	outline: '#64748b',
	outlineVariant: '#334155',

	inverseSurface: '#e2e8f0',
	inverseOnSurface: '#0f172a',
	inversePrimary: '#2563eb',

	scrim: '#000000',
} as const;
