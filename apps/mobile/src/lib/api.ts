import { env } from './env';

let sessionToken: string | null = null;

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${env.apiUrl}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
			...(init.headers ?? {}),
		},
	});
	const body = (await response.json().catch(() => ({}))) as T & { error?: string };
	if (!response.ok) throw new Error(body.error ?? 'Não foi possível concluir a operação.');
	return body;
}

export function setApiSessionToken(token: string) {
	sessionToken = token;
}

export function clearApiSession() {
	sessionToken = null;
}
