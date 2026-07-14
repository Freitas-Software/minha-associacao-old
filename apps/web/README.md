# Web

Aplicacao web da Minha Associacao, construída com TanStack Start.

## Ambiente

Copie os valores de `.env.example` para um arquivo local e ajuste a URL da API quando necessario:

```env
VITE_API_URL=http://localhost:3001
```

Variaveis `VITE_*` sao publicas e nunca devem conter segredos.

## Comandos

Execute a partir da raiz com `pnpm --filter @minha-associacao/web <comando>`:

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
```

O servidor de desenvolvimento usa `http://localhost:3000`. O build de producao e gerado em `.output/` e pode ser iniciado com `pnpm start`.
