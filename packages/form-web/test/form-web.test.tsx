import { createAppTheme } from '@minha-associacao/theme-web';
import { ThemeProvider } from '@mui/material/styles';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setServerErrors, useAppForm, type FormServerErrors } from '@minha-associacao/form-web';
import type { FormValidateOrFn } from '@tanstack/react-form';
import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

interface ContactValues {
	email: string;
	name: string;
}

interface ContactFormProps {
	childrenBeforeFields?: ReactNode;
	focusOnError?: boolean;
	onSubmit?: (
		values: ContactValues,
		form: Parameters<typeof setServerErrors>[0]
	) => Promise<void> | void;
	onSubmitInvalid?: () => void;
	validators?: {
		onBlur?: FormValidateOrFn<ContactValues>;
		onChange?: FormValidateOrFn<ContactValues>;
		onSubmit?: FormValidateOrFn<ContactValues>;
	};
}

const validContact: ContactValues = {
	email: 'contato@example.com',
	name: 'Associação Comunitária',
};

const submitSchema = z
	.object({
		email: z.email('Informe um e-mail válido'),
		name: z.string().trim().min(2, 'Informe o nome'),
	})
	.superRefine((values, context) => {
		if (values.name === 'Bloqueada') {
			context.addIssue({
				code: 'custom',
				message: 'A combinação informada não é permitida',
			});
		}
	});

function ContactForm({
	childrenBeforeFields,
	focusOnError,
	onSubmit = () => {},
	onSubmitInvalid,
	validators = { onSubmit: submitSchema },
}: ContactFormProps) {
	const form = useAppForm({
		defaultValues: { email: '', name: '' } satisfies ContactValues,
		onSubmit: async ({ formApi, value }) => onSubmit(value, formApi),
		onSubmitInvalid,
		validators,
	});

	return (
		<form.AppForm>
			<form.Form
				aria-label="Contato"
				focusOnError={focusOnError}>
				{childrenBeforeFields}
				<form.ErrorSummary fieldLabels={{ email: 'E-mail', name: 'Nome' }} />
				<form.AppField name="name">
					{field => (
						<field.TextField
							helperText="Como a associação é conhecida"
							label="Nome"
						/>
					)}
				</form.AppField>
				<form.AppField name="email">
					{field => (
						<field.TextField
							autoComplete="email"
							inputMode="email"
							label="E-mail"
							type="email"
						/>
					)}
				</form.AppField>
				<form.SubmitButton loadingLabel="Enviando">Salvar</form.SubmitButton>
				<form.ResetButton>Limpar</form.ResetButton>
				<form.Subscribe selector={state => state.isDirty}>
					{isDirty => <output data-testid="dirty-state">{String(isDirty)}</output>}
				</form.Subscribe>
				<form.Subscribe selector={state => state.isTouched}>
					{isTouched => <output data-testid="touched-state">{String(isTouched)}</output>}
				</form.Subscribe>
			</form.Form>
		</form.AppForm>
	);
}

function getInput(name: 'email' | 'name'): HTMLInputElement {
	return screen.getByRole('textbox', { name: name === 'name' ? 'Nome' : 'E-mail' });
}

function getButton(name: 'Limpar' | 'Salvar'): HTMLButtonElement {
	return screen.getByRole('button', { name });
}

async function fillValidContact(user: ReturnType<typeof userEvent.setup>) {
	await user.type(getInput('name'), validContact.name);
	await user.type(getInput('email'), validContact.email);
}

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('web form lifecycle', () => {
	it('maps DOM change, blur, Tab, Shift+Tab, Enter and reset to TanStack Form', async () => {
		const onSubmit = vi.fn();
		const user = userEvent.setup();
		const changeSchema = z.object({
			email: z.string(),
			name: z.string().min(2, 'Use ao menos 2 caracteres'),
		});
		const blurSchema = z.object({
			email: z.string(),
			name: z.string().min(3, 'Use ao menos 3 caracteres'),
		});
		const finalSchema = z.object({
			email: z.email('Informe um e-mail válido'),
			name: z.string().min(5, 'Use ao menos 5 caracteres'),
		});

		render(
			<ContactForm
				onSubmit={onSubmit}
				validators={{ onBlur: blurSchema, onChange: changeSchema, onSubmit: finalSchema }}
			/>
		);

		const nameInput = getInput('name');
		const emailInput = getInput('email');
		const resetButton = getButton('Limpar');
		expect(nameInput.value).toBe('');
		expect(emailInput.value).toBe('');
		expect(resetButton.disabled).toBe(true);
		expect(screen.getByTestId('dirty-state').textContent).toBe('false');
		expect(screen.getByTestId('touched-state').textContent).toBe('false');

		await user.type(nameInput, 'a');
		expect(screen.getByText('Use ao menos 2 caracteres')).toBeTruthy();
		expect(screen.getByTestId('dirty-state').textContent).toBe('true');
		expect(screen.getByTestId('touched-state').textContent).toBe('true');
		expect(resetButton.disabled).toBe(false);

		await user.type(nameInput, 'b');
		await user.tab();
		expect(document.activeElement).toBe(emailInput);
		expect(screen.getByText('Use ao menos 3 caracteres')).toBeTruthy();
		await user.tab({ shift: true });
		expect(document.activeElement).toBe(nameInput);

		await user.clear(nameInput);
		await user.type(nameInput, 'abcd');
		await user.tab();
		await user.type(emailInput, validContact.email);
		await user.keyboard('{Enter}');

		await waitFor(() => {
			expect(screen.getByText('Use ao menos 5 caracteres')).toBeTruthy();
		});
		expect(onSubmit).not.toHaveBeenCalled();
		expect(nameInput.value).toBe('abcd');

		await user.click(resetButton);
		expect(nameInput.value).toBe('');
		expect(emailInput.value).toBe('');
		expect(screen.queryByText('Use ao menos 5 caracteres')).toBeNull();
		expect(screen.getByTestId('dirty-state').textContent).toBe('false');
		expect(screen.getByTestId('touched-state').textContent).toBe('false');
	});

	it('associates labels and descriptions and focuses the first invalid field after submit', async () => {
		const onSubmit = vi.fn();
		const onSubmitInvalid = vi.fn();
		const user = userEvent.setup();
		render(
			<ContactForm
				onSubmit={onSubmit}
				onSubmitInvalid={onSubmitInvalid}
			/>
		);

		await user.click(getButton('Salvar'));

		const nameInput = getInput('name');
		await waitFor(() => {
			expect(document.activeElement).toBe(nameInput);
		});
		expect(onSubmit).not.toHaveBeenCalled();
		expect(onSubmitInvalid).toHaveBeenCalledOnce();
		expect(nameInput.getAttribute('aria-invalid')).toBe('true');
		const descriptionId = nameInput.getAttribute('aria-describedby');
		expect(descriptionId).toBeTruthy();
		expect(document.getElementById(descriptionId as string)?.textContent).toBe('Informe o nome');

		const summary = screen.getByRole('alert');
		expect(summary.getAttribute('aria-live')).toBe('assertive');
		expect(summary.textContent).toContain('Nome: Informe o nome');
		expect(summary.textContent).toContain('E-mail: Informe um e-mail válido');

		await user.click(screen.getByRole('button', { name: 'E-mail: Informe um e-mail válido' }));
		await waitFor(() => {
			expect(document.activeElement?.getAttribute('name')).toBe('email');
		});
	});

	it('announces a pathless error and focuses its summary when no field is invalid', async () => {
		const user = userEvent.setup();
		render(<ContactForm />);
		await user.type(getInput('name'), 'Bloqueada');
		await user.type(getInput('email'), validContact.email);
		await user.click(getButton('Salvar'));

		const summary = await screen.findByRole('alert');
		await waitFor(() => {
			expect(document.activeElement).toBe(summary);
		});
		expect(summary.textContent).toContain('A combinação informada não é permitida');
	});

	it('uses the timer focus fallback and allows consumers to opt out of automatic focus', async () => {
		vi.stubGlobal('requestAnimationFrame', undefined);
		const user = userEvent.setup();
		render(<ContactForm focusOnError={false} />);

		await user.click(getButton('Salvar'));
		await screen.findByRole('alert');
		expect(document.activeElement?.getAttribute('name')).not.toBe('name');

		cleanup();
		render(<ContactForm />);
		await user.click(getButton('Salvar'));
		await waitFor(() => {
			expect(document.activeElement?.getAttribute('name')).toBe('name');
		});
	});

	it('rejects a non-string field at the adapter boundary', () => {
		function InvalidTextFieldFixture() {
			const form = useAppForm({ defaultValues: { active: true } });

			return (
				<form.AppForm>
					<form.AppField name="active">{field => <field.TextField label="Ativo" />}</form.AppField>
				</form.AppForm>
			);
		}

		vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<InvalidTextFieldFixture />)).toThrow(
			'FormTextField only accepts string fields. Field "active" received boolean.'
		);
	});
});

describe('server and submission states', () => {
	it('distributes server errors, announces them and clears a field error after editing', async () => {
		const user = userEvent.setup();
		const serverErrors = {
			fields: { email: 'Este e-mail já está cadastrado' },
			form: 'Não foi possível salvar agora',
		} satisfies FormServerErrors<ContactValues>;
		render(
			<ContactForm
				onSubmit={(_values, form) => {
					setServerErrors(form, serverErrors);
				}}
			/>
		);

		await fillValidContact(user);
		await user.click(getButton('Salvar'));

		const emailInput = getInput('email');
		await waitFor(() => {
			expect(document.activeElement).toBe(emailInput);
		});
		expect(screen.getByRole('alert').textContent).toContain('Não foi possível salvar agora');
		expect(screen.getByText('Este e-mail já está cadastrado')).toBeTruthy();
		expect(emailInput.getAttribute('aria-invalid')).toBe('true');

		await user.type(emailInput, 'x');
		expect(screen.queryByText('Este e-mail já está cadastrado')).toBeNull();
		expect(emailInput.getAttribute('aria-invalid')).not.toBe('true');
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('shows async loading and blocks duplicate submissions', async () => {
		let resolveSubmission = () => {};
		const submission = new Promise<void>(resolve => {
			resolveSubmission = resolve;
		});
		const onSubmit = vi.fn(() => submission);
		const user = userEvent.setup();
		render(<ContactForm onSubmit={onSubmit} />);
		await fillValidContact(user);

		const submitButton = getButton('Salvar');
		await user.dblClick(submitButton);

		expect(onSubmit).toHaveBeenCalledOnce();
		expect(submitButton.disabled).toBe(true);
		expect(submitButton.textContent).toContain('Enviando');
		const formElement = screen.getByRole('form', { name: 'Contato' });
		fireEvent.submit(formElement);
		fireEvent.reset(formElement);
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(getInput('name').value).toBe(validContact.name);

		await act(async () => {
			resolveSubmission();
			await submission;
		});

		await waitFor(() => {
			expect(submitButton.disabled).toBe(false);
		});
		expect(onSubmit).toHaveBeenCalledOnce();
	});

	it('accepts a global-only server error and ignores fields that are not mounted', async () => {
		interface ValuesWithHiddenField extends ContactValues {
			hidden: string;
		}

		function HiddenFieldFixture() {
			const form = useAppForm({
				defaultValues: { ...validContact, hidden: '' } satisfies ValuesWithHiddenField,
				onSubmit: ({ formApi }) => {
					setServerErrors(formApi, { fields: { hidden: 'Erro oculto' } });
					setServerErrors(formApi, { form: 'Falha global' });
				},
			});

			return (
				<form.AppForm>
					<form.Form aria-label="Campo oculto">
						<form.ErrorSummary />
						<form.AppField name="name">{field => <field.TextField label="Nome" />}</form.AppField>
						<form.SubmitButton>Salvar</form.SubmitButton>
					</form.Form>
				</form.AppForm>
			);
		}

		const user = userEvent.setup();
		render(<HiddenFieldFixture />);
		await user.click(screen.getByRole('button', { name: 'Salvar' }));
		const summary = await screen.findByRole('alert');
		expect(summary.textContent).toContain('Falha global');
		expect(summary.textContent).not.toContain('Erro oculto');
	});
});

describe('rendering boundaries and themes', () => {
	it('does not rerender an independent field or submit state when one field changes', async () => {
		const renders = { email: 0, name: 0, submit: 0 };
		const onSubmitRender: ProfilerOnRenderCallback = () => {
			renders.submit += 1;
		};

		function RenderFixture() {
			const form = useAppForm({ defaultValues: { email: '', name: '' } satisfies ContactValues });

			return (
				<form.AppForm>
					<form.Form aria-label="Renderização">
						<form.AppField name="name">
							{field => {
								renders.name += 1;
								return <field.TextField label="Nome" />;
							}}
						</form.AppField>
						<form.AppField name="email">
							{field => {
								renders.email += 1;
								return <field.TextField label="E-mail" />;
							}}
						</form.AppField>
						<Profiler
							id="submit"
							onRender={onSubmitRender}>
							<form.SubmitButton>Salvar</form.SubmitButton>
						</Profiler>
					</form.Form>
				</form.AppForm>
			);
		}

		const user = userEvent.setup();
		render(<RenderFixture />);
		const initialRenders = { ...renders };
		await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'A');

		expect(renders.name).toBeGreaterThan(initialRenders.name);
		expect(renders.email).toBe(initialRenders.email);
		expect(renders.submit).toBe(initialRenders.submit);
	});

	it.each([
		'light',
		'dark',
	] as const)('inherits the %s MUI theme without fixed colors', async mode => {
		const user = userEvent.setup();
		render(
			<ThemeProvider theme={createAppTheme(mode)}>
				<ContactForm />
			</ThemeProvider>
		);

		await user.click(getButton('Salvar'));
		const summary = await screen.findByRole('alert');
		expect(summary.style.borderInlineStart.toLowerCase()).toContain('currentcolor');
		expect(summary.style.boxSizing).toBe('border-box');
		expect(summary.style.overflowWrap).toBe('anywhere');
		expect(summary.style.color).toBe('');
		expect(getInput('name').style.color).toBe('');
	});
});
