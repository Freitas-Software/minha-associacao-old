import { useContext } from 'react';
import { OrganizacaoContext } from '@/contexts/OrganizacaoContext';

export function useOrganizacao() {
	const context = useContext(OrganizacaoContext);

	if (!context) {
		throw new Error('useOrganizacao must be used inside OrganizacaoProvider');
	}

	return context;
}
