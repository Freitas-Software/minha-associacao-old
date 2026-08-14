import { themes } from '@minha-associacao/design-tokens';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native-paper', () => ({
	configureFonts: ({ config }: { config: unknown }) => config,
	MD3DarkTheme: { colors: {}, dark: true, fonts: {}, roundness: 0, version: 3 },
	MD3LightTheme: { colors: {}, dark: false, fonts: {}, roundness: 0, version: 3 },
}));

import { createPaperTheme } from './create-paper-theme';

describe('createPaperTheme', () => {
	it.each(['light', 'dark'] as const)('maps semantic colors for the %s theme', mode => {
		const definition = themes[mode];
		const paperTheme = createPaperTheme(definition);

		expect(paperTheme.dark).toBe(mode === 'dark');
		expect(paperTheme.colors.background).toBe(definition.colors.canvas);
		expect(paperTheme.colors.onBackground).toBe(definition.colors.contentPrimary);
		expect(paperTheme.colors.primary).toBe(definition.colors.actionPrimary);
		expect(paperTheme.colors.onPrimary).toBe(definition.colors.actionPrimaryContent);
		expect(paperTheme.colors.onPrimaryContainer).toBe(definition.colors.actionPrimarySubtleContent);
		expect(paperTheme.colors.onTertiary).toBe(definition.colors.feedbackPositiveContent);
		expect(paperTheme.colors.onTertiaryContainer).toBe(
			definition.colors.feedbackPositiveSubtleContent
		);
		expect(paperTheme.colors.outline).toBe(definition.colors.borderControl);
	});

	it('keeps the dark canvas and text paired', () => {
		const paperTheme = createPaperTheme(themes.dark);

		expect(paperTheme.colors.background).toBe('#17191a');
		expect(paperTheme.colors.onBackground).toBe('#ffffff');
	});
});
