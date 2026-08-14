import { createContext } from 'react';

export type OrganizacaoContextValue = {
	organizacaoId: string;
};

export const OrganizacaoContext = createContext<OrganizacaoContextValue | null>(null);
