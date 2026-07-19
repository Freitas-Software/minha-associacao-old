import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

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
	const content = (
		<Stack
			spacing={2}
			sx={{
				alignItems: 'center',
				mx: 'auto',
				maxWidth: 480,
				px: 3,
				py: 6,
				textAlign: 'center',
			}}>
			{icon ? (
				<Box
					aria-hidden
					sx={{
						alignItems: 'center',
						color: 'text.secondary',
						display: 'flex',
						fontSize: 48,
						justifyContent: 'center',

						'& > svg': {
							fontSize: 'inherit',
						},
					}}>
					{icon}
				</Box>
			) : null}

			<Stack spacing={0.75}>
				<Typography variant="h6">{title}</Typography>

				{description ? (
					<Typography
						color="text.secondary"
						variant="body2">
						{description}
					</Typography>
				) : null}
			</Stack>

			{action || secondaryAction ? (
				<Stack
					direction={{
						xs: 'column',
						sm: 'row',
					}}
					spacing={1}>
					{action}
					{secondaryAction}
				</Stack>
			) : null}
		</Stack>
	);

	if (!contained) {
		return content;
	}

	return (
		<Paper
			sx={{
				borderStyle: 'dashed',
				p: 1,
			}}
			variant="outlined">
			{content}
		</Paper>
	);
}
