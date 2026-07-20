# `@minha-associacao/form-web`

Adapters web de TanStack Form para os primitives de `@minha-associacao/ui-web`. O pacote reutiliza
os contextos de `@minha-associacao/form-core`, mantém inputs base independentes da biblioteca de
formulário e não conhece aplicações, entidades de negócio, API ou tema.

## API pública

- `useAppForm`: hook configurado com `AppField`, `TextField`, `Form`, `ErrorSummary`,
  `SubmitButton` e `ResetButton`;
- `withForm`: composição tipada de formulários reutilizáveis;
- `setServerErrors`: distribui uma falha de servidor entre mensagem global e campos montados;
- tipos das props dos componentes pré-vinculados e `FormServerErrors`.

O schema Zod é passado diretamente em `validators` pelo contrato Standard Schema. Não use resolver:

```tsx
import { setServerErrors, useAppForm } from '@minha-associacao/form-web';
import { z } from 'zod';

const schema = z.object({
  email: z.email('Informe um e-mail válido'),
  name: z.string().trim().min(2, 'Informe o nome'),
});

type Values = z.input<typeof schema>;

export function ContactForm() {
  const form = useAppForm({
    defaultValues: { email: '', name: '' } satisfies Values,
    validators: { onSubmit: schema },
    onSubmit: async ({ formApi, value }) => {
      const result = await saveContact(value);

      if (!result.ok) {
        setServerErrors(formApi, {
          form: result.message,
          fields: result.fieldErrors,
        });
      }
    },
  });

  return (
    <form.AppForm>
      <form.Form aria-label="Contato">
        <form.ErrorSummary fieldLabels={{ email: 'E-mail', name: 'Nome' }} />
        <form.AppField name="name">
          {field => <field.TextField label="Nome" />}
        </form.AppField>
        <form.AppField name="email">
          {field => <field.TextField inputMode="email" label="E-mail" type="email" />}
        </form.AppField>
        <form.SubmitButton loadingLabel="Salvando">Salvar</form.SubmitButton>
        <form.ResetButton>Limpar</form.ResetButton>
      </form.Form>
    </form.AppForm>
  );
}
```

`TextField` aceita somente campos `string` e reserva `name`, `value`, `defaultValue`, `onChange`,
`onBlur` e props de erro para o adapter. Crie adapters separados para booleanos, números, selects ou
datas; não force esses valores pelo campo de texto.

## Comportamento

- eventos DOM são convertidos para `handleChange(value)` e `handleBlur()`;
- erros aparecem apenas depois de interação, blur, submissão ou resposta de servidor;
- label, helper/erro, `aria-invalid` e regiões de anúncio permanecem associados;
- uma submissão inválida foca o primeiro controle inválido na ordem do DOM; se o erro não possui
  caminho, o resumo recebe foco;
- itens de campo no resumo podem devolver o foco ao controle correspondente;
- `SubmitButton` deriva `disabled` e `loading` de `canSubmit` e `isSubmitting` e o formulário mantém
  um lock adicional contra submissões duplicadas;
- `ResetButton` fica indisponível enquanto o formulário está intacto ou submetendo e o evento
  `reset` restaura valores e metadados pelo TanStack Form;
- erros `onServer` são limpos pelo próximo ciclo de edição/validação do TanStack Form;
- campos assinam apenas seu próprio estado; ações assinam slices escalares para não rerenderizar em
  toda alteração do formulário.

O pacote não instala provider de tema. A aplicação deve fornecer o `ThemeProvider`; estilos próprios
do resumo usam `currentColor` e herdam o modo claro ou escuro.
