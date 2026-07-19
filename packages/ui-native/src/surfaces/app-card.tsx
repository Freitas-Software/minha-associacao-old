import { spacing } from '@minha-associacao/design-tokens';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, type CardProps, Divider, Text } from 'react-native-paper';

export interface AppCardProps extends Omit<CardProps, 'children' | 'elevation' | 'mode'> {
	title?: ReactNode;
	description?: ReactNode;
	headerAction?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	disableContentPadding?: boolean;
	dividers?: boolean;
	mode?: 'elevated' | 'outlined' | 'contained';
}

export function AppCard({
	title,
	description,
	headerAction,
	children,
	footer,
	disableContentPadding = false,
	dividers = false,
	mode = 'outlined',
	...cardProps
}: AppCardProps) {
	const hasHeader = Boolean(title) || Boolean(description) || Boolean(headerAction);

	return (
		<Card
			{...cardProps}
			mode={mode}>
			{hasHeader ? (
				<>
					<View style={styles.header}>
						<View style={styles.headerCopy}>
							{title ? <Text variant="titleMedium">{title}</Text> : null}
							{description ? <Text variant="bodyMedium">{description}</Text> : null}
						</View>
						{headerAction}
					</View>
					{dividers ? <Divider /> : null}
				</>
			) : null}

			<Card.Content style={disableContentPadding ? styles.noPadding : styles.content}>
				{children}
			</Card.Content>

			{footer ? (
				<>
					{dividers ? <Divider /> : null}
					<Card.Actions style={styles.footer}>{footer}</Card.Actions>
				</>
			) : null}
		</Card>
	);
}

export interface AppCardSectionProps {
	title?: ReactNode;
	description?: ReactNode;
	children: ReactNode;
}

export function AppCardSection({ title, description, children }: AppCardSectionProps) {
	return (
		<View style={styles.section}>
			{title || description ? (
				<View style={styles.sectionCopy}>
					{title ? <Text variant="titleSmall">{title}</Text> : null}
					{description ? <Text variant="bodySmall">{description}</Text> : null}
				</View>
			) : null}
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingVertical: spacing.lg,
	},
	footer: {
		justifyContent: 'flex-end',
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: spacing.md,
		justifyContent: 'space-between',
		padding: spacing.lg,
	},
	headerCopy: {
		flex: 1,
		gap: spacing.xs,
	},
	noPadding: {
		paddingHorizontal: 0,
		paddingVertical: 0,
	},
	section: {
		gap: spacing.lg,
	},
	sectionCopy: {
		gap: spacing.xs,
	},
});
