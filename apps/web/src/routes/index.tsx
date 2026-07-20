import { createFileRoute } from '@tanstack/react-router';
import { useAppForm } from '@minha-associacao/form-web';
import { z } from 'zod';

export const Route = createFileRoute('/')({ component: Home });

const fixtureSchema = z.object({
	email: z.email('Informe um e-mail válido para continuar'),
	name: z.string().min(2, 'Informe o nome completo da associação'),
});

function Home() {
	const form = useAppForm({
		defaultState: { submissionAttempts: 1 },
		defaultValues: { email: '', name: '' },
		validators: { onMount: fixtureSchema, onSubmit: fixtureSchema },
	});

	return (
		<main
			style={{
				inlineSize: 'min(100%, 40rem)',
				marginInline: 'auto',
				padding: 'clamp(1rem, 4vw, 3rem)',
			}}>
			<h1>Fixture responsiva de formulário web</h1>
			<form.AppForm>
				<form.Form
					aria-label="Cadastro de contato"
					style={{ display: 'grid', gap: '1rem' }}>
					<form.ErrorSummary fieldLabels={{ email: 'E-mail', name: 'Nome' }} />
					<form.AppField name="name">
						{field => (
							<field.TextField
								helperText="Use o nome público pelo qual a organização é reconhecida na comunidade."
								label="Nome"
							/>
						)}
					</form.AppField>
					<form.AppField name="email">
						{field => (
							<field.TextField
								inputMode="email"
								label="E-mail"
								type="email"
							/>
						)}
					</form.AppField>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
						<form.SubmitButton loadingLabel="Salvando">Salvar</form.SubmitButton>
						<form.ResetButton>Limpar</form.ResetButton>
					</div>
				</form.Form>
			</form.AppForm>
		</main>
	);
}
