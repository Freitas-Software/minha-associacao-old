import type React from 'react';
import { useMemo, useState } from 'react';
import { AuthContext, type AuthContextValue, type AuthSession } from '@/contexts/AuthContext';

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
			signOut: () => setSessionState(null),
		}),
		[session]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
