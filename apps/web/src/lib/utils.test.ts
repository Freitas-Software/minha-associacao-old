import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
	it('removes conflicting Tailwind classes and ignores falsey values', () => {
		expect(cn('px-2', false, 'px-4', undefined, 'text-sm')).toBe('px-4 text-sm');
	});
});
