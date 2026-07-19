import { InputAdornment, type OutlinedTextFieldProps, Skeleton, TextField } from '@mui/material';
import type { ReactNode } from 'react';

type AllowedTextFieldProps = Omit<
	OutlinedTextFieldProps,
	'error' | 'helperText' | 'size' | 'variant'
>;

export interface AppTextFieldProps extends AllowedTextFieldProps {
	errorMessage?: string;
	helperText?: ReactNode;
	loading?: boolean;
	startAdornment?: ReactNode;
	endAdornment?: ReactNode;
}

export function AppTextField({
	errorMessage,
	helperText,
	loading = false,
	startAdornment,
	endAdornment,
	disabled,
	slotProps,
	...textFieldProps
}: AppTextFieldProps) {
	if (loading) {
		return (
			<Skeleton
				aria-label="Carregando campo"
				height={40}
				variant="rounded"
				width="100%"
			/>
		);
	}

	return (
		<TextField
			{...textFieldProps}
			disabled={disabled}
			error={Boolean(errorMessage)}
			helperText={errorMessage ?? helperText}
			size="small"
			slotProps={{
				...slotProps,
				input: ownerState => {
					const inputProps =
						typeof slotProps?.input === 'function' ? slotProps.input(ownerState) : slotProps?.input;

					return {
						...inputProps,
						startAdornment: startAdornment ? (
							<InputAdornment position="start">{startAdornment}</InputAdornment>
						) : (
							inputProps?.startAdornment
						),
						endAdornment: endAdornment ? (
							<InputAdornment position="end">{endAdornment}</InputAdornment>
						) : (
							inputProps?.endAdornment
						),
					};
				},
			}}
			variant="outlined"
		/>
	);
}
