import {
	resolveThemeId,
	type ThemeMode,
	type ThemePreference,
} from '@minha-associacao/design-tokens';
import { ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import type { MinhaAssociacaoPaperTheme } from '@/theme/create-paper-theme';
import { createNavigationTheme } from '@/theme/create-navigation-theme';
import { paperThemes } from '@/theme/paper-themes';

interface AppThemeContextValue {
	mode: ThemeMode;
	preference: ThemePreference;
	isDark: boolean;
	setPreference: (preference: ThemePreference) => void;
	toggleMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function resolveThemeMode(
	preference: ThemePreference,
	systemColorScheme: ReturnType<typeof useColorScheme>
): ThemeMode {
	return resolveThemeId(preference, systemColorScheme === 'dark' ? 'dark' : 'light');
}

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const systemColorScheme = useColorScheme();
	const [preference, setPreference] = useState<ThemePreference>('system');
	const mode = resolveThemeMode(preference, systemColorScheme);

	const theme = useMemo(() => paperThemes[mode], [mode]);
	const navigationTheme = useMemo(
		() => createNavigationTheme(theme.minhaAssociacao),
		[theme.minhaAssociacao]
	);

	useEffect(() => {
		void SystemUI.setBackgroundColorAsync(theme.minhaAssociacao.colors.canvas);
	}, [theme.minhaAssociacao.colors.canvas]);

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
			<PaperProvider theme={theme}>
				<ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
			</PaperProvider>
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
	return useTheme<MinhaAssociacaoPaperTheme>();
}
