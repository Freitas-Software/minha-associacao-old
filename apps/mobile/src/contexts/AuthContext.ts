import { createContext } from 'react';

export interface AuthUser {
	id: string;
	name: string;
}

export interface AuthSession {
	user: AuthUser;
}

export interface AuthContextValue {
	session: AuthSession | null;
	isLoading: boolean;

	/**
	 * Temporário.
	 *
	 * Posteriormente isso será chamado somente após
	 * autenticação bem-sucedida na API.
	 */
	setSession: (session: AuthSession) => void;
	register: (input: {
		name: string;
		documentNumber: string;
		email: string;
		password: string;
	}) => Promise<void>;
	signIn: (input: { documentNumber: string; password: string }) => Promise<void>;

	signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
