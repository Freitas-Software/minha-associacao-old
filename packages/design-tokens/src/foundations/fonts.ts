import type { FontFamilyDefinition } from '../contracts';

export const geistFont = {
	id: 'geist',
	family: 'Geist',
	mobile: {
		regular: 'Geist_400Regular',
		medium: 'Geist_500Medium',
		semiBold: 'Geist_600SemiBold',
		bold: 'Geist_700Bold',
	},
	web: {
		family: 'Geist',
		fallback: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	},
} as const satisfies FontFamilyDefinition;

export const geistMonoFont = {
	id: 'geist-mono',
	family: 'Geist Mono',
	mobile: {
		regular: 'GeistMono_400Regular',
		medium: 'GeistMono_500Medium',
		semiBold: 'GeistMono_600SemiBold',
		bold: 'GeistMono_700Bold',
	},
	web: {
		family: 'Geist Mono',
		fallback: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
	},
} as const satisfies FontFamilyDefinition;
