import { describe, expect, it } from 'vitest';
import { isValidCpf, normalizeCpf } from '../../src/lib/cpf.js';

describe('CPF helpers', () => {
	it('normalizes punctuation and whitespace', () => {
		expect(normalizeCpf(' 529.982.247-25 ')).toBe('52998224725');
	});

	it('accepts valid formatted and unformatted CPFs', () => {
		expect(isValidCpf('52998224725')).toBe(true);
		expect(isValidCpf('529.982.247-25')).toBe(true);
	});

	it.each(['52998224724', '11111111111', '123', 'not-a-cpf'])('rejects an invalid CPF: %s', cpf => {
		expect(isValidCpf(cpf)).toBe(false);
	});
});
