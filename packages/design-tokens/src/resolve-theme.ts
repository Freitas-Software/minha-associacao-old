import type { ThemeId, ThemeMode, ThemePreference } from './contracts';
import { themeIds } from './contracts';

export function isThemeId(value: unknown): value is ThemeId {
	return typeof value === 'string' && (themeIds as readonly string[]).includes(value);
}

export function isThemePreference(value: unknown): value is ThemePreference {
	return value === 'system' || isThemeId(value);
}

export function resolveThemeId(preference: ThemePreference, systemMode: ThemeMode): ThemeId {
	return preference === 'system' ? systemMode : preference;
}
