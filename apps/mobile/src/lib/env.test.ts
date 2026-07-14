import { describe, expect, it } from 'vitest';
import { DEFAULT_API_URL, parsePublicApiUrl } from './env';

describe('parsePublicApiUrl', () => {
	it('uses the local API when EXPO_PUBLIC_API_URL is omitted', () => {
		expect(parsePublicApiUrl(undefined)).toBe(DEFAULT_API_URL);
	});

	it('normalizes a trailing slash', () => {
		expect(parsePublicApiUrl('https://api.example.com/')).toBe('https://api.example.com');
	});

	it('rejects non-HTTP protocols', () => {
		expect(() => parsePublicApiUrl('file:///tmp/api')).toThrow(
			'EXPO_PUBLIC_API_URL must use HTTP or HTTPS.'
		);
	});

	it('rejects malformed URLs', () => {
		expect(() => parsePublicApiUrl('not-a-url')).toThrow(
			'EXPO_PUBLIC_API_URL must be a valid URL.'
		);
	});
});
