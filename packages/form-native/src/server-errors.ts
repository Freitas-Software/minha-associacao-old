import type { AnyFormApi, DeepKeys } from '@tanstack/react-form';

type FormValues<TForm extends AnyFormApi> = TForm['state']['values'];

export interface FormServerErrors<TFormData> {
	fields?: Partial<Record<DeepKeys<TFormData>, unknown>>;
	form?: unknown;
}

export function setServerErrors<TForm extends AnyFormApi>(
	form: TForm,
	errors: FormServerErrors<FormValues<TForm>>
) {
	const fieldErrors = errors.fields ?? {};

	for (const fieldName of Object.keys(fieldErrors)) {
		if (form.getFieldMeta(fieldName)) {
			form.setFieldMeta(fieldName, previousMeta => ({
				...previousMeta,
				isTouched: true,
			}));
		}
	}

	form.setErrorMap({
		onServer: {
			fields: fieldErrors,
			form: errors.form,
		},
	});
}
