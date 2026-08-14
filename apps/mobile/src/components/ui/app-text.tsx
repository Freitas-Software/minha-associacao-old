import type { ReactNode } from 'react';
import { Text, type TextProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

type PaperTextVariant = NonNullable<TextProps<string>['variant']>;

export type AppTextTone =
	| 'primary'
	| 'secondary'
	| 'muted'
	| 'accent'
	| 'inverse'
	| 'positive'
	| 'warning'
	| 'negative'
	| 'info';
export type AppTextVariant = PaperTextVariant | 'moneyLarge' | 'moneyMedium' | 'moneySmall';
export type AppTextProps = Omit<TextProps<string>, 'variant'> & {
	children: ReactNode;
	tone?: AppTextTone;
	variant?: AppTextVariant;
};

const moneyVariants = {
	moneyLarge: 'titleLarge',
	moneyMedium: 'bodyLarge',
	moneySmall: 'bodySmall',
} as const;

export function AppText({
	children,
	tone = 'primary',
	variant = 'bodyMedium',
	style,
	...props
}: AppTextProps) {
	const theme = useMinhaAssociacaoTheme();
	const { colors, typography } = theme.minhaAssociacao;
	const color = {
		primary: colors.contentPrimary,
		secondary: colors.contentSecondary,
		muted: colors.contentMuted,
		accent: colors.brandAccent,
		inverse: colors.contentInverse,
		positive: colors.feedbackPositiveSubtleContent,
		warning: colors.feedbackWarningSubtleContent,
		negative: colors.feedbackNegative,
		info: colors.feedbackInfoSubtleContent,
	}[tone];
	const moneyKey =
		variant === 'moneyLarge' || variant === 'moneyMedium' || variant === 'moneySmall'
			? variant
			: undefined;
	const moneyStyle = moneyKey ? typography.scale[moneyKey] : undefined;
	const paperVariant: PaperTextVariant = moneyKey
		? moneyVariants[moneyKey]
		: (variant as PaperTextVariant);
	return (
		<Text
			{...props}
			variant={paperVariant}
			style={[
				{ color },
				moneyStyle && {
					fontFamily: typography[moneyStyle.fontFamily].mobile[moneyStyle.fontWeight],
					fontSize: moneyStyle.fontSize,
					fontWeight: '400',
					letterSpacing: moneyStyle.letterSpacing,
					lineHeight: moneyStyle.lineHeight,
				},
				style,
			]}>
			{children}
		</Text>
	);
}
