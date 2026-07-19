import { type EntityStatus, entityStatusLabels } from '@minha-associacao/ui-core';
import { Chip, type ChipProps, useTheme } from 'react-native-paper';

import { getNativeStatusChipAppearance } from './status-chip-config';

export interface StatusChipProps
	extends Omit<
		ChipProps,
		'accessibilityLabel' | 'accessibilityRole' | 'children' | 'mode' | 'selectedColor' | 'theme'
	> {
	status: EntityStatus;
	label?: string;
	accessibilityLabel?: string;
}

export function StatusChip({
	status,
	label,
	accessibilityLabel,
	style,
	textStyle,
	...chipProps
}: StatusChipProps) {
	const theme = useTheme();
	const appearance = getNativeStatusChipAppearance(status, theme.colors);
	const resolvedLabel = label ?? entityStatusLabels[status];

	return (
		<Chip
			{...chipProps}
			accessibilityLabel={accessibilityLabel ?? `Status: ${resolvedLabel}`}
			accessibilityRole="text"
			compact
			mode={appearance.mode}
			style={[
				{
					backgroundColor: appearance.backgroundColor,
					borderColor: appearance.borderColor,
				},
				style,
			]}
			textStyle={[{ color: appearance.textColor }, textStyle]}>
			{resolvedLabel}
		</Chip>
	);
}
