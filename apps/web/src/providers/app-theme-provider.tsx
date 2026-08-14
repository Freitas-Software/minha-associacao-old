import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | ThemeMode;

export const APP_THEME_STORAGE_KEY = 'minha-associacao:theme';

export const appThemeBootstrapScript = `(() => {
	try {
		const stored = window.localStorage.getItem('${APP_THEME_STORAGE_KEY}');
		const preference = stored === 'light' || stored === 'dark' ? stored : 'system';
		const mode = preference === 'system'
			? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: preference;
		const root = document.documentElement;
		root.classList.toggle('dark', mode === 'dark');
		root.dataset.theme = mode;
		root.style.colorScheme = mode;
	} catch {}
})();`;

interface AppThemeContextValue {
	isDark: boolean;
	mode: ThemeMode;
	preference: ThemePreference;
	setPreference: (preference: ThemePreference) => void;
	toggleMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function readSystemMode(): ThemeMode {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function isThemePreference(value: unknown): value is ThemePreference {
	return value === 'system' || value === 'light' || value === 'dark';
}

function readStoredPreference(): ThemePreference {
	if (typeof window === 'undefined') return 'system';
	try {
		const stored = window.localStorage.getItem(APP_THEME_STORAGE_KEY);
		return isThemePreference(stored) ? stored : 'system';
	} catch {
		return 'system';
	}
}

export function AppThemeProvider({ children }: PropsWithChildren) {
	const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);
	const [systemMode, setSystemMode] = useState<ThemeMode>(readSystemMode);
	const mode = preference === 'system' ? systemMode : preference;

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => setSystemMode(media.matches ? 'dark' : 'light');
		handleChange();
		media.addEventListener('change', handleChange);
		return () => media.removeEventListener('change', handleChange);
	}, []);

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === APP_THEME_STORAGE_KEY && isThemePreference(event.newValue)) {
				setPreference(event.newValue);
			}
		};
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', mode === 'dark');
		document.documentElement.dataset.theme = mode;
		document.documentElement.style.colorScheme = mode;
	}, [mode]);

	useEffect(() => {
		try {
			window.localStorage.setItem(APP_THEME_STORAGE_KEY, preference);
		} catch {
			// O tema ainda funciona quando o armazenamento do navegador está indisponível.
		}
	}, [preference]);

	const toggleMode = useCallback(() => setPreference(mode === 'dark' ? 'light' : 'dark'), [mode]);
	const value = useMemo(
		() => ({ isDark: mode === 'dark', mode, preference, setPreference, toggleMode }),
		[mode, preference, toggleMode]
	);

	return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
	const context = useContext(AppThemeContext);
	if (!context) throw new Error('useAppTheme must be used inside AppThemeProvider');
	return context;
}
