import type { EntityStatus } from '@minha-associacao/ui-core';

export interface NativeStatusChipColors {
	errorContainer: string;
	onErrorContainer: string;
	onPrimaryContainer: string;
	onSurfaceVariant: string;
	onTertiaryContainer: string;
	outline: string;
	primaryContainer: string;
	surface: string;
	tertiaryContainer: string;
}

export interface NativeStatusChipAppearance {
	backgroundColor: string;
	borderColor: string;
	mode: 'flat' | 'outlined';
	textColor: string;
}

export function getNativeStatusChipAppearance(
	status: EntityStatus,
	colors: NativeStatusChipColors
): NativeStatusChipAppearance {
	switch (status) {
		case 'active':
			return {
				backgroundColor: colors.primaryContainer,
				borderColor: 'transparent',
				mode: 'flat',
				textColor: colors.onPrimaryContainer,
			};
		case 'pending':
			return {
				backgroundColor: colors.tertiaryContainer,
				borderColor: 'transparent',
				mode: 'flat',
				textColor: colors.onTertiaryContainer,
			};
		case 'blocked':
			return {
				backgroundColor: colors.errorContainer,
				borderColor: 'transparent',
				mode: 'flat',
				textColor: colors.onErrorContainer,
			};
		case 'inactive':
		case 'archived':
			return {
				backgroundColor: colors.surface,
				borderColor: colors.outline,
				mode: 'outlined',
				textColor: colors.onSurfaceVariant,
			};
	}
}
