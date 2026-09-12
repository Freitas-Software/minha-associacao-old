import type React from 'react';
import { useMemo, useState } from 'react';
import { AuthContext, type AuthContextValue, type AuthSession } from '@/contexts/AuthContext';
import { apiRequest, clearApiSession, setApiSessionToken } from '@/lib/api';

export function AuthProvider({ children }: React.PropsWithChildren) {
	const [session, setSessionState] = useState<AuthSession | null>(null);

	/**
	 * Hoje não existe recuperação de sessão.
	 *
	 * Quando implementarmos SecureStore + backend,
	 * esse valor começará como true.
	 */
	const isLoading = false;

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			isLoading,
			setSession: nextSession => setSessionState(nextSession),
			register: async input => {
				const result = await apiRequest<{
					token: string;
					user: { id: string; name: string | null };
				}>('/api/registrations', { method: 'POST', body: JSON.stringify(input) });
				setApiSessionToken(result.token);
				setSessionState({ user: { id: result.user.id, name: result.user.name ?? input.name } });
			},
			signIn: async input => {
				const result = await apiRequest<{ token: string }>('/api/sessions', {
					method: 'POST',
					body: JSON.stringify(input),
				});
				setApiSessionToken(result.token);
				const profile = await apiRequest<{ user: { id: string; name: string | null } }>('/api/me');
				setSessionState({ user: { id: profile.user.id, name: profile.user.name ?? 'Usuário' } });
			},
			signOut: () => {
				clearApiSession();
				setSessionState(null);
			},
		}),
		[session]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
