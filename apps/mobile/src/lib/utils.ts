export function calculateDigit(digits: number[], initialWeight: number): number {
	const sum = digits.reduce((acc, digit, index) => acc + digit * (initialWeight - index), 0);

	const remainder = sum % 11;

	return remainder < 2 ? 0 : 11 - remainder;
}

export function formatCPF(cpf: string): string {
	return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}
