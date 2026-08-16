import { themes } from '@minha-associacao/design-tokens';
import { describe, expect, it } from 'vitest';
import { appThemeCss, createAppThemeCssVariables } from './app-theme-css';

describe('app theme CSS adapter', () => {
	it('maps semantic design tokens to the web component contract', () => {
		const variables = createAppThemeCssVariables(themes.light);

		expect(variables['--background']).toBe(themes.light.colors.canvas);
		expect(variables['--primary']).toBe(themes.light.colors.actionPrimary);
		expect(variables['--destructive']).toBe(themes.light.colors.feedbackNegative);
		expect(variables['--radius']).toBe('0.75rem');
	});

	it('serializes both themes for server rendering before hydration', () => {
		expect(appThemeCss).toContain(':root{color-scheme:light;');
		expect(appThemeCss).toContain(':root.dark{color-scheme:dark;');
		expect(appThemeCss).toContain(`--background:${themes.dark.colors.canvas}`);
	});
});
