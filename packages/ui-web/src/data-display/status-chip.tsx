import { type EntityStatus, entityStatusLabels } from '@minha-associacao/ui-core';
import { Chip, type ChipProps } from '@mui/material';

type StatusColor = 'default' | 'success' | 'warning' | 'error';

interface StatusConfiguration {
	color: StatusColor;
	variant: 'filled' | 'outlined';
}

const statusConfiguration: Record<EntityStatus, StatusConfiguration> = {
	active: {
		color: 'success',
		variant: 'filled',
	},
	inactive: {
		color: 'default',
		variant: 'outlined',
	},
	pending: {
		color: 'warning',
		variant: 'filled',
	},
	blocked: {
		color: 'error',
		variant: 'filled',
	},
	archived: {
		color: 'default',
		variant: 'outlined',
	},
};

export interface StatusChipProps extends Omit<ChipProps, 'color' | 'label' | 'variant'> {
	status: EntityStatus;
	label?: string;
}

export function StatusChip({ status, label, size = 'small', ...chipProps }: StatusChipProps) {
	const configuration = statusConfiguration[status];

	return (
		<Chip
			{...chipProps}
			color={configuration.color}
			label={label ?? entityStatusLabels[status]}
			size={size}
			variant={configuration.variant}
		/>
	);
}
