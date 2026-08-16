import { describe, expect, it } from 'vitest';
import { generateCPF } from './faker';
import { calculateDigit } from './utils';

function expectValidCPF(cpf: string): void {
	const digits = cpf.replace(/\D/g, '').split('').map(Number);
	const base = digits.slice(0, 9);
	const firstDigit = calculateDigit(base, 10);
	const secondDigit = calculateDigit([...base, firstDigit], 11);

	expect(digits).toHaveLength(11);
	expect(new Set(base).size).toBeGreaterThan(1);
	expect(digits.slice(9)).toEqual([firstDigit, secondDigit]);
}

describe('generateCPF', () => {
	it('generates a valid unformatted CPF', () => {
		const cpf = generateCPF();

		expect(cpf).toMatch(/^\d{11}$/);
		expectValidCPF(cpf);
	});

	it('generates a valid formatted CPF', () => {
		const cpf = generateCPF(true);

		expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
		expectValidCPF(cpf);
	});
});
