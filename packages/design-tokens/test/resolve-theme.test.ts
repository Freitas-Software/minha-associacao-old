import { describe, expect, it } from 'vitest';
import {
	brandPalette,
	darkTheme,
	isThemeId,
	isThemePreference,
	lightTheme,
	resolveThemeId,
	themes,
} from '../src';

describe('theme definitions', () => {
	it('exposes the complete light and dark themes', () => {
		expect(themes.light).toBe(lightTheme);
		expect(themes.dark).toBe(darkTheme);
		expect(lightTheme.colors.actionPrimary).toBe('#2e7d32');
		expect(darkTheme.colors.actionPrimary).toBe('#2e7d32');
		expect(lightTheme.colors.avatarBackground).toBe(brandPalette.avatarPurple);
		expect(darkTheme.colors.avatarContent).toBe(brandPalette.textOnDark);
		expect(brandPalette.avatarPurple).toBe('#7140b4');
		expect(lightTheme.typography.interface.family).toBe('Geist');
	});

	it('does not expose colors from the previous blue identity', () => {
		const previousBrandColors = new Set(['#2563eb', '#93c5fd', '#dbeafe', '#1e3a8a']);

		for (const theme of Object.values(themes)) {
			for (const color of Object.values(theme.colors)) {
				expect(previousBrandColors).not.toContain(color.toLowerCase());
			}
		}
	});
});

describe('theme preference resolution', () => {
	it('keeps explicit choices and resolves the system preference', () => {
		expect(resolveThemeId('light', 'dark')).toBe('light');
		expect(resolveThemeId('dark', 'light')).toBe('dark');
		expect(resolveThemeId('system', 'light')).toBe('light');
		expect(resolveThemeId('system', 'dark')).toBe('dark');
	});

	it('validates theme identifiers and preferences', () => {
		expect(isThemeId('light')).toBe(true);
		expect(isThemeId('system')).toBe(false);
		expect(isThemePreference('system')).toBe(true);
		expect(isThemePreference('high-contrast')).toBe(false);
	});
});
