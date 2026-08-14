import type { ComponentProps, ReactNode } from 'react';
import { View } from 'react-native';
import { Card } from 'react-native-paper';
import { AppDivider } from './app-surface';
import { AppText } from './app-text';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export interface AppCardProps
	extends Omit<ComponentProps<typeof Card>, 'children' | 'elevation' | 'mode'> {
	children: ReactNode;
	description?: ReactNode;
	disableContentPadding?: boolean;
	dividers?: boolean;
	footer?: ReactNode;
	headerAction?: ReactNode;
	title?: ReactNode;
}
export function AppCard({
	children,
	description,
	disableContentPadding = false,
	dividers = false,
	footer,
	headerAction,
	title,
	...props
}: AppCardProps) {
	const theme = useMinhaAssociacaoTheme();
	const colors = theme.minhaAssociacao.colors;
	const hasHeader = Boolean(title) || Boolean(description) || Boolean(headerAction);
	return (
		<Card
			{...props}
			mode="outlined"
			style={[{ backgroundColor: colors.surface, borderColor: colors.borderDefault }, props.style]}>
			{hasHeader ? (
				<>
					<View
						style={{
							alignItems: 'center',
							flexDirection: 'row',
							gap: theme.minhaAssociacao.spacing.md,
							justifyContent: 'space-between',
							padding: theme.minhaAssociacao.spacing.lg,
						}}>
						<View style={{ flex: 1, gap: theme.minhaAssociacao.spacing.xs }}>
							{title ? (
								<AppText
									accessibilityRole="header"
									variant="titleMedium">
									{title}
								</AppText>
							) : null}
							{description ? <AppText tone="secondary">{description}</AppText> : null}
						</View>
						{headerAction}
					</View>
					{dividers ? <AppDivider /> : null}
				</>
			) : null}
			<Card.Content
				style={
					disableContentPadding
						? { padding: 0 }
						: { paddingVertical: theme.minhaAssociacao.spacing.lg }
				}>
				{children}
			</Card.Content>
			{footer ? (
				<>
					{dividers ? <AppDivider /> : null}
					<Card.Actions
						style={{
							paddingHorizontal: theme.minhaAssociacao.spacing.lg,
							paddingVertical: theme.minhaAssociacao.spacing.md,
						}}>
						{footer}
					</Card.Actions>
				</>
			) : null}
		</Card>
	);
}
export function AppCardSection({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description?: ReactNode;
	title?: ReactNode;
}) {
	const theme = useMinhaAssociacaoTheme();
	return (
		<View style={{ gap: theme.minhaAssociacao.spacing.lg }}>
			{title || description ? (
				<View style={{ gap: theme.minhaAssociacao.spacing.xs }}>
					{title ? (
						<AppText
							accessibilityRole="header"
							variant="titleSmall">
							{title}
						</AppText>
					) : null}
					{description ? (
						<AppText
							tone="secondary"
							variant="bodySmall">
							{description}
						</AppText>
					) : null}
				</View>
			) : null}
			{children}
		</View>
	);
}
