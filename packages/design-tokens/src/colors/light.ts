import type { SemanticColors } from './types.js';

export const lightColors: SemanticColors = {
	primary: '#2563eb',
	onPrimary: '#ffffff',
	primaryContainer: '#dbeafe',
	onPrimaryContainer: '#172554',

	secondary: '#475569',
	onSecondary: '#ffffff',
	secondaryContainer: '#e2e8f0',
	onSecondaryContainer: '#0f172a',

	tertiary: '#7c3aed',
	onTertiary: '#ffffff',
	tertiaryContainer: '#ede9fe',
	onTertiaryContainer: '#2e1065',

	error: '#b91c1c',
	onError: '#ffffff',
	errorContainer: '#fee2e2',
	onErrorContainer: '#450a0a',

	background: '#ecefec',
	onBackground: '#232123',

	surface: '#ffffff',
	onSurface: '#0f172a',

	surfaceVariant: '#f1f5f9',
	onSurfaceVariant: '#475569',

	outline: '#94a3b8',
	outlineVariant: '#cbd5e1',

	inverseSurface: '#1e293b',
	inverseOnSurface: '#f8fafc',
	inversePrimary: '#93c5fd',

	scrim: '#000000',
} as const;
