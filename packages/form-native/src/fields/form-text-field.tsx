import { normalizeFieldErrors, useFieldContext } from '@minha-associacao/form-core';
import { AppTextField, type AppTextFieldProps } from '@minha-associacao/ui-native';

export type FormTextFieldProps = Omit<
	AppTextFieldProps,
	'errorMessage' | 'onBlur' | 'onChangeText' | 'value'
>;

export function FormTextField(props: FormTextFieldProps) {
	const field = useFieldContext<string>();
	const { meta, value } = field.state;

	if (typeof value !== 'string') {
		throw new TypeError(
			`FormTextField only accepts string fields. Field "${field.name}" received ${typeof value}.`
		);
	}

	const showError = meta.isTouched || meta.isBlurred || meta.errorMap.onServer !== undefined;

	const errorMessage = showError ? normalizeFieldErrors(meta.errors)[0] : undefined;

	return (
		<AppTextField
			{...props}
			errorMessage={errorMessage}
			onBlur={field.handleBlur}
			onChangeText={nextValue => {
				if (field.state.meta.errorMap.onServer !== undefined) {
					field.setMeta(previousMeta => ({
						...previousMeta,
						errorMap: {
							...previousMeta.errorMap,
							onServer: undefined,
						},
					}));
				}

				field.handleChange(nextValue);
			}}
			value={value}
		/>
	);
}
