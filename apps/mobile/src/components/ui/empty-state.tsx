import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppSurface } from './app-surface';
import { AppText } from './app-text';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export interface EmptyStateProps {
	action?: ReactNode;
	contained?: boolean;
	description?: ReactNode;
	icon?: ReactNode;
	secondaryAction?: ReactNode;
	title: ReactNode;
}
export function EmptyState({
	action,
	contained = false,
	description,
	icon,
	secondaryAction,
	title,
}: EmptyStateProps) {
	const theme = useMinhaAssociacaoTheme();
	const content = (
		<View
			style={{
				alignItems: 'center',
				alignSelf: 'center',
				gap: theme.minhaAssociacao.spacing.lg,
				maxWidth: 480,
				paddingHorizontal: theme.minhaAssociacao.spacing.xl,
				paddingVertical: theme.minhaAssociacao.spacing['3xl'],
				width: '100%',
			}}>
			{icon ? (
				<View
					accessibilityElementsHidden
					importantForAccessibility="no-hide-descendants">
					{icon}
				</View>
			) : null}
			<View style={{ gap: theme.minhaAssociacao.spacing.sm }}>
				<AppText
					accessibilityRole="header"
					style={{ textAlign: 'center' }}
					variant="titleLarge">
					{title}
				</AppText>
				{description ? (
					<AppText
						style={{ textAlign: 'center' }}
						tone="secondary">
						{description}
					</AppText>
				) : null}
			</View>
			{action || secondaryAction ? (
				<View style={{ alignSelf: 'stretch', gap: theme.minhaAssociacao.spacing.sm }}>
					{action}
					{secondaryAction}
				</View>
			) : null}
		</View>
	);
	return contained ? (
		<AppSurface
			style={{
				borderColor: theme.minhaAssociacao.colors.borderDefault,
				borderStyle: 'dashed',
				borderWidth: 1,
			}}>
			{content}
		</AppSurface>
	) : (
		content
	);
}
