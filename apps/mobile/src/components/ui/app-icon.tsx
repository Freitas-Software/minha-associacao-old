import {
	MaterialDesignIcons,
	type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import type { ComponentProps } from 'react';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppIconTone =
	| 'primary'
	| 'secondary'
	| 'muted'
	| 'accent'
	| 'inverse'
	| 'positive'
	| 'warning'
	| 'negative';

export interface AppIconProps
	extends Omit<ComponentProps<typeof MaterialDesignIcons>, 'name' | 'size'> {
	name: MaterialDesignIconsIconName;
	size?: number;
	tone?: AppIconTone;
}

export function AppIcon({ color, name, size = 24, tone = 'primary', ...props }: AppIconProps) {
	const { colors } = useMinhaAssociacaoTheme().minhaAssociacao;
	const semanticColor = {
		primary: colors.contentPrimary,
		secondary: colors.contentSecondary,
		muted: colors.contentMuted,
		accent: colors.brandAccent,
		inverse: colors.contentInverse,
		positive: colors.feedbackPositiveSubtleContent,
		warning: colors.feedbackWarningSubtleContent,
		negative: colors.feedbackNegative,
	}[tone];

	return (
		<MaterialDesignIcons
			{...props}
			color={color ?? semanticColor}
			name={name}
			size={size}
		/>
	);
}
