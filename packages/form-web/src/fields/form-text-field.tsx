import { normalizeFieldErrors, useFieldContext } from '@minha-associacao/form-core';
import { AppTextField } from '@minha-associacao/ui-web';
import { useId, type HTMLAttributes, type HTMLInputTypeAttribute, type ReactNode } from 'react';

export interface FormTextFieldProps {
	autoComplete?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	helperText?: ReactNode;
	id?: string;
	inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
	label: ReactNode;
	multiline?: boolean;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	rows?: number | string;
	type?: HTMLInputTypeAttribute;
}

export function FormTextField({
	autoComplete,
	autoFocus,
	disabled,
	fullWidth = true,
	helperText,
	id,
	inputMode,
	label,
	multiline,
	placeholder,
	readOnly,
	required,
	rows,
	type,
}: FormTextFieldProps) {
	const generatedId = useId();
	const field = useFieldContext<string>();
	const { meta, value } = field.state;

	if (typeof value !== 'string') {
		throw new TypeError(
			`FormTextField only accepts string fields. Field "${field.name}" received ${typeof value}.`
		);
	}

	const showError = meta.isTouched || meta.isBlurred;
	const errorMessage = showError ? normalizeFieldErrors(meta.errors)[0] : undefined;

	return (
		<AppTextField
			autoComplete={autoComplete}
			autoFocus={autoFocus}
			disabled={disabled}
			errorMessage={errorMessage}
			fullWidth={fullWidth}
			helperText={helperText}
			id={id ?? generatedId}
			label={label}
			multiline={multiline}
			name={field.name}
			onBlur={field.handleBlur}
			onChange={event => {
				if (field.state.meta.errorMap.onServer !== undefined) {
					field.setMeta(previousMeta => ({
						...previousMeta,
						errorMap: {
							...previousMeta.errorMap,
							onServer: undefined,
						},
					}));
				}

				field.handleChange(event.currentTarget.value);
			}}
			placeholder={placeholder}
			required={required}
			rows={rows}
			slotProps={{
				htmlInput: {
					inputMode,
					readOnly,
				},
				formHelperText: {
					'aria-live': errorMessage ? 'polite' : undefined,
				},
			}}
			type={type}
			value={value}
		/>
	);
}
