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
pnpm export
pnpm expo:check
```

`pnpm export` gera bundles locais em `dist/` quando necessario. Ele nao cria builds EAS nem
publica updates. O gate padrao (`pnpm build`) nao executa exportacao mobile porque a
exportacao nativa ainda precisa de estabilizacao no Metro; a CI valida o app com
`pnpm expo:check`.
Para executar uma operacao remota EAS de forma intencional, use um dos comandos abaixo:

```bash
pnpm eas:development
pnpm eas:preview
pnpm eas:production
pnpm eas:submit
pnpm eas:rollback
```

Os perfis `development`, `preview` e `production` usam canais EAS Update separados. O
`runtimeVersion` usa a politica `fingerprint`, portanto alteracoes nativas exigem um novo
build compativel; alteracoes somente JavaScript podem ser entregues por EAS Update.
Consulte [../../docs/mobile-release.md](../../docs/mobile-release.md) antes de publicar.
