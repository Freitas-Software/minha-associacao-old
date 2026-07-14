# Mobile

Aplicacao Expo da Minha Associacao para Android, iOS e web.

## Ambiente

Use `.env.example` como referencia e ajuste a URL para um endereco acessivel pelo dispositivo ou emulador:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Variaveis `EXPO_PUBLIC_*` ficam visiveis no bundle e nunca devem conter segredos.

## Comandos

Execute a partir da raiz com `pnpm --filter @minha-associacao/mobile <comando>`:

```bash
pnpm dev
pnpm android
pnpm ios
pnpm web
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
```

`pnpm build` exporta os bundles para `dist/`. Builds nativos usam os perfis `development`, `preview` e `production` de `eas.json`.
