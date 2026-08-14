import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';
import { APP_THEME_STORAGE_KEY, appThemeBootstrapScript } from './app-theme-provider';

function runBootstrap({ stored, systemDark }: { stored: string | null; systemDark: boolean }) {
	const toggle = vi.fn();
	const root = {
		classList: { toggle },
		dataset: {} as Record<string, string>,
		style: {} as Record<string, string>,
	};
	const getItem = vi.fn((key: string) => (key === APP_THEME_STORAGE_KEY ? stored : null));

	runInNewContext(appThemeBootstrapScript, {
		document: { documentElement: root },
		window: {
			localStorage: { getItem },
			matchMedia: vi.fn(() => ({ matches: systemDark })),
		},
	});

	return { getItem, root, toggle };
}

describe('appThemeBootstrapScript', () => {
	it('aplica a preferência persistida antes da hidratação', () => {
		const { root, toggle } = runBootstrap({ stored: 'dark', systemDark: false });

		expect(toggle).toHaveBeenCalledWith('dark', true);
		expect(root.dataset.theme).toBe('dark');
		expect(root.style.colorScheme).toBe('dark');
	});

	it('segue o sistema quando não há preferência explícita', () => {
		const { root, toggle } = runBootstrap({ stored: 'system', systemDark: true });

		expect(toggle).toHaveBeenCalledWith('dark', true);
		expect(root.dataset.theme).toBe('dark');
		expect(root.style.colorScheme).toBe('dark');
	});
});
