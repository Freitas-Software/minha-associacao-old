import { describe, expect, it } from 'vitest';

import { nativeButtonConfiguration, nativeButtonMinHeight } from '../src/actions/app-button-config';

describe('native button configuration', () => {
	it('maps semantic variants to supported Paper modes', () => {
		expect(nativeButtonConfiguration).toEqual({
			primary: { mode: 'contained', useErrorColors: false },
			secondary: { mode: 'contained-tonal', useErrorColors: false },
			outline: { mode: 'outlined', useErrorColors: false },
			ghost: { mode: 'text', useErrorColors: false },
			danger: { mode: 'contained', useErrorColors: true },
		});
	});

	it('keeps every size at or above the minimum touch target', () => {
		expect(Object.values(nativeButtonMinHeight).every(height => height >= 44)).toBe(true);
	});
});
