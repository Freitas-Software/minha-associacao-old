import { fakerPT_BR } from '@faker-js/faker';
import { calculateDigit, formatCPF } from './utils';

export const faker = fakerPT_BR;

faker.seed(20260808);

export function generateCPF(formatted = false): string {
	let base: number[];

	do {
		base = Array.from({ length: 9 }, () => faker.number.int({ min: 0, max: 9 }));
	} while (new Set(base).size === 1);

	const firstDigit = calculateDigit(base, 10);
	const secondDigit = calculateDigit([...base, firstDigit], 11);

	const cpf = [...base, firstDigit, secondDigit].join('');

	return formatted ? formatCPF(cpf) : cpf;
}
