import { useAppForm, type FormTextFieldProps } from '@minha-associacao/form-web';
import { expectTypeOf, it } from 'vitest';
import { z } from 'zod';

const schema = z.object({
	profile: z.object({
		displayName: z.string(),
	}),
});

type Values = z.input<typeof schema>;

const invalidTextFieldProps = {
	label: 'Nome de exibição',
	// @ts-expect-error form adapters own their controlled value
	value: 'escape',
} satisfies FormTextFieldProps;

function TypedFixture() {
	const form = useAppForm({
		defaultValues: { profile: { displayName: '' } } satisfies Values,
		validators: { onSubmit: schema },
	});

	expectTypeOf(form.state.values).toEqualTypeOf<Values>();

	return (
		<form.AppForm>
			<form.Form>
				<form.AppField name="profile.displayName">
					{field => {
						expectTypeOf(field.state.value).toEqualTypeOf<string>();
						return <field.TextField label="Nome de exibição" />;
					}}
				</form.AppField>
				{/* @ts-expect-error unknown field names must be rejected */}
				<form.AppField name="profile.unknown">{() => null}</form.AppField>
			</form.Form>
		</form.AppForm>
	);
}

it('keeps the typed fixture available to the compiler', () => {
	expectTypeOf(TypedFixture).toBeFunction();
	expectTypeOf(invalidTextFieldProps.label).toEqualTypeOf<string>();
});
