import type React from 'react';
import { useMemo } from 'react';
import { OrganizacaoContext } from '@/contexts/OrganizacaoContext';

type OrganizacaoProviderProps = React.PropsWithChildren<{
	organizacaoId: string;
}>;

export function OrganizacaoProvider({ organizacaoId, children }: OrganizacaoProviderProps) {
	const value = useMemo(
		() => ({
			organizacaoId,
		}),
		[organizacaoId]
	);

	return <OrganizacaoContext.Provider value={value}>{children}</OrganizacaoContext.Provider>;
}
