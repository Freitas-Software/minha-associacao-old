import { AppChip, type AppChipProps } from './app-chip';

export type EntityStatus = 'active' | 'inactive' | 'pending' | 'blocked' | 'archived';
export const entityStatusLabels: Record<EntityStatus, string> = {
	active: 'Ativo',
	inactive: 'Inativo',
	pending: 'Pendente',
	blocked: 'Bloqueado',
	archived: 'Arquivado',
};
export interface StatusChipProps extends Omit<AppChipProps, 'children' | 'variant'> {
	status: EntityStatus;
	label?: string;
}

export function StatusChip({ label, status, ...props }: StatusChipProps) {
	const variant =
		status === 'blocked'
			? 'danger'
			: status === 'active'
				? 'primary'
				: status === 'pending'
					? 'default'
					: 'outlined';
	return (
		<AppChip
			{...props}
			accessibilityLabel={`Status: ${label ?? entityStatusLabels[status]}`}
			variant={variant}>
			{label ?? entityStatusLabels[status]}
		</AppChip>
	);
}
