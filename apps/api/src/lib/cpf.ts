export function normalizeCpf(value: string): string {
	return value.trim().replace(/[.\-\s]/g, '');
}

export function isValidCpf(value: string): boolean {
	const cpf = normalizeCpf(value);

	if (!/^\d{11}$/.test(cpf)) return false;

	if (/^(\d)\1{10}$/.test(cpf)) return false;

	const calculateDigit = (length: number): number => {
		let sum = 0;

		for (let index = 0; index < length; index++) {
			sum += Number(cpf[index]) * (length + 1 - index);
		}

		const remainder = (sum * 10) % 11;

		return remainder === 10 ? 0 : remainder;
	};

	const firstDigit = calculateDigit(9);

	if (firstDigit !== Number(cpf[9])) return false;

	const secondDigit = calculateDigit(10);

	return secondDigit === Number(cpf[10]);
}
