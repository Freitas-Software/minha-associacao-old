export const DEFAULT_API_URL = 'http://localhost:3001';

export function parsePublicApiUrl(value: string | undefined): string {
	const candidate = value?.trim() || DEFAULT_API_URL;
	let url: URL;

	try {
		url = new URL(candidate);
	} catch {
		throw new Error('EXPO_PUBLIC_API_URL must be a valid URL.');
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new Error('EXPO_PUBLIC_API_URL must use HTTP or HTTPS.');
	}

	return url.toString().replace(/\/$/, '');
}

export const env = Object.freeze({
	apiUrl: parsePublicApiUrl(process.env.EXPO_PUBLIC_API_URL),
});
