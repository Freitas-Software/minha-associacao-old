import { createNativeTheme, type NativeThemeMode } from '@minha-associacao/theme-native';
import * as SystemUI from 'expo-system-ui';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';

export type ThemePreference = 'system' | NativeThemeMode;

interface AppThemeContextValue {
	mode: NativeThemeMode;
	preference: ThemePreference;
	isDark: boolean;
	setPreference: (preference: ThemePreference) => void;
	toggleMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function resolveThemeMode(
	preference: ThemePreference,
	systemColorScheme: ReturnType<typeof useColorScheme>
): NativeThemeMode {
	if (preference !== 'system') {
		return preference;
	}

	return systemColorScheme === 'dark' ? 'dark' : 'light';
}

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const systemColorScheme = useColorScheme();
	const [preference, setPreference] = useState<ThemePreference>('system');
	const mode = resolveThemeMode(preference, systemColorScheme);

	const theme = useMemo(() => createNativeTheme(mode), [mode]);

	useEffect(() => {
		void SystemUI.setBackgroundColorAsync(theme.colors.background);
	}, [theme.colors.background]);

	const toggleMode = useCallback(() => {
		setPreference(currentPreference =>
			resolveThemeMode(currentPreference, systemColorScheme) === 'light' ? 'dark' : 'light'
		);
	}, [systemColorScheme]);

	const contextValue = useMemo(
		() => ({
			mode,
			preference,
			isDark: mode === 'dark',
			setPreference,
			toggleMode,
		}),
		[mode, preference, toggleMode]
	);

	return (
		<AppThemeContext.Provider value={contextValue}>
			<PaperProvider theme={theme}>{children}</PaperProvider>
		</AppThemeContext.Provider>
	);
};

export function useAppTheme() {
	const context = useContext(AppThemeContext);

	if (!context) {
		throw new Error('useAppTheme must be used inside AppThemeProvider');
	}

	return context;
}

export function useNativeTheme() {
	return useTheme<ReturnType<typeof createNativeTheme>>();
}
