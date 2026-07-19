import { spacing } from '@minha-associacao/design-tokens';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export interface EmptyStateProps {
	title: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	action?: ReactNode;
	secondaryAction?: ReactNode;
	contained?: boolean;
}

export function EmptyState({
	title,
	description,
	icon,
	action,
	secondaryAction,
	contained = false,
}: EmptyStateProps) {
	const theme = useTheme();
	const content = (
		<View style={styles.content}>
			{icon ? (
				<View
					accessibilityElementsHidden
					importantForAccessibility="no-hide-descendants"
					style={styles.icon}>
					{icon}
				</View>
			) : null}

			<View style={styles.copy}>
				<Text
					accessibilityRole="header"
					style={styles.centeredText}
					variant="titleLarge">
					{title}
				</Text>
				{description ? (
					<Text
						style={[styles.centeredText, { color: theme.colors.onSurfaceVariant }]}
						variant="bodyMedium">
						{description}
					</Text>
				) : null}
			</View>

			{action || secondaryAction ? (
				<View style={styles.actions}>
					{action}
					{secondaryAction}
				</View>
			) : null}
		</View>
	);

	if (!contained) {
		return content;
	}

	return (
		<Surface
			elevation={0}
			style={[
				styles.surface,
				{
					borderColor: theme.colors.outline,
				},
			]}>
			{content}
		</Surface>
	);
}

const styles = StyleSheet.create({
	actions: {
		alignSelf: 'stretch',
		gap: spacing.sm,
	},
	centeredText: {
		textAlign: 'center',
	},
	content: {
		alignItems: 'center',
		alignSelf: 'center',
		gap: spacing.lg,
		maxWidth: 480,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing['3xl'],
		width: '100%',
	},
	copy: {
		gap: spacing.sm,
	},
	icon: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	surface: {
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});
