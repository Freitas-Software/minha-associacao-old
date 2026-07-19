import { darkColors, lightColors } from '@minha-associacao/design-tokens';
import { describe, expect, it } from 'vitest';

import { getNativeStatusChipAppearance } from '../src/data-display/status-chip-config';

describe('native status chip appearance', () => {
	it.each([
		['active', 'primaryContainer', 'onPrimaryContainer'],
		['pending', 'tertiaryContainer', 'onTertiaryContainer'],
		['blocked', 'errorContainer', 'onErrorContainer'],
	] as const)('uses semantic filled colors for %s', (status, background, foreground) => {
		const appearance = getNativeStatusChipAppearance(status, lightColors);

		expect(appearance).toMatchObject({
			backgroundColor: lightColors[background],
			mode: 'flat',
			textColor: lightColors[foreground],
		});
	});

	it.each([
		'inactive',
		'archived',
	] as const)('uses an outlined neutral treatment for %s', status => {
		const appearance = getNativeStatusChipAppearance(status, darkColors);

		expect(appearance).toEqual({
			backgroundColor: darkColors.surface,
			borderColor: darkColors.outline,
			mode: 'outlined',
			textColor: darkColors.onSurfaceVariant,
		});
	});
});
