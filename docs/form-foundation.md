# Form foundation

The shared form foundation uses TanStack Form `1.33.2` and Zod 4 through the Standard
Schema contract. It is intentionally limited to React form contexts, validation contracts and
error normalization that can be reused by both web and native applications.

Where the source PDFs conflict, `Implementação Monorepo.pdf` is authoritative: its TanStack Form
decision supersedes the older React Hook Form reference in the UI system guide.

## Package boundaries

- `@minha-associacao/form-core` owns the shared field/form contexts and platform-neutral error
  helpers.
- Future `form-web` and `form-native` packages will bind those contexts to their own visual
  components with `createFormHook`.
- Base inputs remain independent from TanStack Form and usable outside a form.
- Eventos DOM, eventos React Native e props de bibliotecas de UI nunca cruzam a fronteira do pacote
  boundary.
- Schemas and payload types may be shared; rendered fields and platform behavior may not.
- The package is source-first so Vite and Metro compile the same TypeScript entrypoint without
  depending on an ignored or stale `dist` directory.

`@tanstack/react-form` is a runtime dependency because both clients use React. React itself remains
a peer dependency. TanStack Form reexports its headless core contracts, so this package does not
declare the upstream core a second time.

## Shared contexts

Both platform adapters must import the same context pair:

```ts
import {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from '@minha-associacao/form-core';
```

Each adapter may then call `createFormHook` with its own field and form components. Do not create a
universal component that attempts to normalize DOM and React Native events.

## Standard Schema and Zod

Zod 4 schemas are passed directly to TanStack Form. No Zod resolver or adapter is needed:

```ts
import { formOptions } from '@tanstack/react-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Informe o nome'),
});

type Values = z.input<typeof schema>;

export const memberFormOptions = formOptions({
  defaultValues: { name: '' } satisfies Values,
  validators: { onSubmit: schema },
});
```

Standard Schema outputs and Zod transforms do not replace the values held by the form. Parse again
inside the submit boundary when a transformed output is required by the API payload.

## Validation lifecycle

- `onChange`: use only for cheap local checks whose immediate feedback helps the user.
- `onBlur`: prefer for field format and completeness after the user finishes an interaction.
- `onSubmit`: enforce the definitive schema and cross-field invariants.
- `onDynamic`: reserve for deliberate conditional or cross-field revalidation.
- Async validators: reserve for remote or expensive checks, debounce when appropriate and honor the
  provided `AbortSignal` so stale responses do not replace current state.

Do not show aggressive validation before a field is touched, blurred or a submission is attempted.
Default values must match `z.input<typeof schema>` and controlled fields should avoid `undefined`.

## Error contract

TanStack Form treats validation errors as `unknown`. Standard Schema field errors are issue arrays,
while form-level schema errors are grouped by field. Server failures may also include a global error
and a field map.

Use:

- `normalizeFieldErrors` for a field's `meta.errors`;
- `normalizeFormErrors` for a TanStack form error map, including pathless issues stored under the
  empty key;
- `normalizeServerErrors(formError, fieldErrors)` for an explicit server global/field pair;
- `getFirstFormErrorMessage` with an already normalized result when an adapter needs the first
  actionable message for a summary or focus flow.

The helpers discard blank messages, remove duplicates, preserve field ownership and safely accept
prototype-like field names. They inspect only own data properties from explicit message/error
wrappers, skip accessors, tolerate cycles and sparse arrays, and do not expose internal metadata as
UI copy. Visual display, focus management and screen-reader announcements remain responsibilities
of the platform adapters.

## Follow-up milestones

Os adaptadores de formulário web vivem em `apps/web/src`, junto dos componentes shadcn/ui. Eles
adicionam eventos DOM, descrições acessíveis, foco e comportamento de plataforma sem fazer o
`form-core` depender do renderizador.

Os adaptadores mobile vivem em `apps/mobile/src`, junto dos componentes React Native Paper. Eles
adicionam eventos nativos, teclado, rolagem, anúncios e testes orientados a dispositivos. Nenhum
adapter deve substituir os contextos compartilhados ou acoplar os primitives de UI ao TanStack
Form. Quando houver subscribers, eles devem ser granulares e justificar qualquer teste de
contagem de renderizações.
