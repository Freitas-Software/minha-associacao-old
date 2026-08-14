import {
	ActivityIndicator,
	type ActivityIndicatorProps,
	Badge,
	type BadgeProps,
	HelperText,
	type HelperTextProps,
	ProgressBar,
	type ProgressBarProps,
} from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppFeedbackTone = 'primary' | 'positive' | 'warning' | 'negative' | 'info';
function useFeedbackColor(tone: AppFeedbackTone) {
	const theme = useMinhaAssociacaoTheme().minhaAssociacao;
	const colors = theme.colors;
	return {
		primary: colors.actionPrimaryText,
		positive: colors.feedbackPositive,
		warning: colors.feedbackWarning,
		negative: colors.feedbackNegative,
		info: colors.feedbackInfo,
	}[tone];
}
export function AppActivityIndicator({
	tone = 'primary',
	...props
}: ActivityIndicatorProps & { tone?: AppFeedbackTone }) {
	return (
		<ActivityIndicator
			{...props}
			color={useFeedbackColor(tone)}
		/>
	);
}
export function AppProgressBar({
	style,
	tone = 'primary',
	...props
}: ProgressBarProps & { tone?: AppFeedbackTone }) {
	const theme = useMinhaAssociacaoTheme();
	return (
		<ProgressBar
			{...props}
			color={useFeedbackColor(tone)}
			style={[
				{
					backgroundColor: theme.minhaAssociacao.colors.surfaceInteractive,
					borderRadius: theme.minhaAssociacao.radii.pill,
				},
				style,
			]}
		/>
	);
}
export function AppBadge({
	style,
	tone = 'negative',
	...props
}: BadgeProps & { tone?: AppFeedbackTone }) {
	const theme = useMinhaAssociacaoTheme();
	const colors = theme.minhaAssociacao.colors;
	const contentColor = {
		primary: colors.actionPrimaryContent,
		positive: colors.feedbackPositiveContent,
		warning: colors.feedbackWarningContent,
		negative: colors.feedbackNegativeContent,
		info: colors.feedbackInfoContent,
	}[tone];
	return (
		<Badge
			{...props}
			style={[
				{
					backgroundColor: useFeedbackColor(tone),
					color: contentColor,
				},
				style,
			]}
		/>
	);
}
export function AppHelperText({ style, type = 'info', ...props }: HelperTextProps) {
	const theme = useMinhaAssociacaoTheme();
	return (
		<HelperText
			{...props}
			style={[
				{
					color:
						type === 'error'
							? theme.minhaAssociacao.colors.feedbackNegative
							: theme.minhaAssociacao.colors.contentSecondary,
				},
				style,
			]}
			type={type}
		/>
	);
}
