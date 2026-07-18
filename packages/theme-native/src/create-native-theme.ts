import { darkNativeTheme } from './dark-theme.js';
import { lightNativeTheme } from './light-theme.js';
import type { NativeTheme, NativeThemeMode } from './types.js';

export function createNativeTheme(mode: NativeThemeMode): NativeTheme {
	return mode === 'dark' ? darkNativeTheme : lightNativeTheme;
}
