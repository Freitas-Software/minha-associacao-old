import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	type CardProps,
	Divider,
	Stack,
	Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface AppCardProps extends Omit<CardProps, 'title'> {
	title?: ReactNode;
	description?: ReactNode;
	headerAction?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	disableContentPadding?: boolean;
	dividers?: boolean;
}

export function AppCard({
	title,
	description,
	headerAction,
	children,
	footer,
	disableContentPadding = false,
	dividers = false,
	...cardProps
}: AppCardProps) {
	const hasHeader = Boolean(title) || Boolean(description) || Boolean(headerAction);

	return (
		<Card {...cardProps}>
			{hasHeader ? (
				<>
					<CardHeader
						action={headerAction}
						subheader={description}
						title={title}
						titleTypographyProps={{
							variant: 'h6',
						}}
					/>

					{dividers ? <Divider /> : null}
				</>
			) : null}

			<CardContent sx={disableContentPadding ? { p: 0, '&:last-child': { pb: 0 } } : undefined}>
				{children}
			</CardContent>

			{footer ? (
				<>
					{dividers ? <Divider /> : null}

					<CardActions
						sx={{
							justifyContent: 'flex-end',
							px: 3,
							py: 2,
						}}>
						{footer}
					</CardActions>
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
		<Stack spacing={2}>
			{title || description ? (
				<Box>
					{title ? <Typography variant="subtitle1">{title}</Typography> : null}

					{description ? (
						<Typography
							color="text.secondary"
							variant="body2">
							{description}
						</Typography>
					) : null}
				</Box>
			) : null}

			{children}
		</Stack>
	);
}
