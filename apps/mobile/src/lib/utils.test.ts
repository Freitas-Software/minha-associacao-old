import { describe, expect, it } from 'vitest';
import { calculateDigit, formatCPF } from './utils';

describe('CPF utilities', () => {
	it('calculates both CPF verification digits', () => {
		const base = [5, 2, 9, 9, 8, 2, 2, 4, 7];

		const firstDigit = calculateDigit(base, 10);
		const secondDigit = calculateDigit([...base, firstDigit], 11);

		expect([firstDigit, secondDigit]).toEqual([2, 5]);
	});

	it('returns zero when the remainder is below two', () => {
		expect(calculateDigit([0], 2)).toBe(0);
	});

	it('formats an eleven-digit CPF', () => {
		expect(formatCPF('52998224725')).toBe('529.982.247-25');
	});
});
