import { themes } from '@minha-associacao/design-tokens';
import { describe, expect, it } from 'vitest';
import { createNavigationTheme } from './create-navigation-theme';

describe('createNavigationTheme', () => {
	it.each(['light', 'dark'] as const)('maps every Router color from the %s design theme', mode => {
		const definition = themes[mode];
		const navigationTheme = createNavigationTheme(definition);

		expect(navigationTheme.dark).toBe(mode === 'dark');
		expect(navigationTheme.colors).toEqual({
			primary: definition.colors.actionPrimary,
			background: definition.colors.canvas,
			card: definition.colors.navigationBackground,
			text: definition.colors.navigationContent,
			border: definition.colors.borderSubtle,
			notification: definition.colors.feedbackWarning,
		});
	});

	it('uses the dark canvas and readable content in dark mode', () => {
		const navigationTheme = createNavigationTheme(themes.dark);

		expect(navigationTheme.colors.background).toBe(themes.dark.colors.canvas);
		expect(navigationTheme.colors.card).toBe(themes.dark.colors.navigationBackground);
		expect(navigationTheme.colors.text).toBe(themes.dark.colors.navigationContent);
		expect(navigationTheme.colors.background).not.toBe(themes.light.colors.canvas);
	});
});
