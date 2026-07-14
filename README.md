# Minha Associacao

Monorepo da plataforma Minha Associacao. O repositorio reune a API, os clientes web e
mobile e os pacotes internos usados pelas aplicacoes.

## Estrutura

```text
apps/
  api/       API Fastify
  mobile/    aplicativo Expo / React Native
  web/       aplicacao TanStack Start
packages/
  config/    leitura e validacao de configuracao da API
  ts-config/ configuracoes TypeScript compartilhadas
```

O workspace usa pnpm para dependencias e Turborepo para ordenar e armazenar em cache as
tarefas. Dependencias internas devem sempre usar o protocolo `workspace:`.

## Requisitos

- Node.js `24.18.0` (consulte `.node-version`)
- pnpm `11.12.0`
- Docker com Compose v2, opcional

Ative o pnpm fornecido pelo Corepack e instale as dependencias:

```bash
corepack enable
corepack install
pnpm install
```

## Ambiente local

Crie os arquivos locais a partir dos exemplos versionados:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Variaveis principais:

| Aplicacao | Variavel | Finalidade |
| --- | --- | --- |
| API | `HOST` | Interface de rede da API |
| API | `PORT` | Porta HTTP da API |
| API | `CORS_ALLOWED_ORIGINS` | Origens permitidas, separadas por virgula |
| Web | `VITE_API_URL` | URL publica da API usada pelo navegador |
| Mobile | `EXPO_PUBLIC_API_URL` | URL publica da API usada pelo aplicativo |

Os exemplos de ambiente usam web em `http://localhost:3000` e API em
`http://localhost:8080`. Em um dispositivo fisico, `EXPO_PUBLIC_API_URL` deve apontar para
o endereco da maquina na rede local, e nao para `localhost`.

Inicie todo o workspace:

```bash
pnpm dev
```

Ou execute somente o fluxo necessario:

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:mobile
```

`dev:web` tambem inicia a API. Os comandos com filtro podem ser usados diretamente para
investigar um workspace:

```bash
pnpm --filter @minha-associacao/api dev
pnpm --filter @minha-associacao/web test
```

## Qualidade

Antes de abrir um pull request, execute o gate local completo:

```bash
pnpm verify
```

Os comandos podem ser executados separadamente:

| Comando | Verificacao |
| --- | --- |
| `pnpm format:check` | formatacao sem alterar arquivos |
| `pnpm lint` | regras estaticas do workspace |
| `pnpm typecheck` | tipos TypeScript |
| `pnpm test` | testes automatizados |
| `pnpm test:coverage` | testes com thresholds e relatorios de cobertura |
| `pnpm check:generated` | artefatos gerados atualizados |
| `pnpm boundaries` | fronteiras entre pacotes |
| `pnpm build` | builds de producao |

Use `pnpm format` para aplicar a formatacao. A CI executa os testes com cobertura, preserva
os relatorios como artefato e constroi as imagens da API e do web sem publica-las.

## Containers

Suba API e web com os valores locais padrao:

```bash
docker compose up --build
```

Para construir cada imagem separadamente:

```bash
docker build -f apps/api/Dockerfile -t minha-associacao-api .
docker build \
  --build-arg VITE_API_URL=http://localhost:3001 \
  -f apps/web/Dockerfile \
  -t minha-associacao-web \
  .
```

Os Dockerfiles podam o grafo do monorepo com `turbo prune`, instalam pelo lockfile e
executam os processos como usuario sem privilegios. Em producao, informe URLs e origens
reais durante o build/deploy; nao reutilize os valores de `localhost`.

## Colaboracao e seguranca

As regras para mudancas no workspace estao em [CONTRIBUTING.md](CONTRIBUTING.md). Para
relatar uma vulnerabilidade sem exposicao publica, siga [SECURITY.md](SECURITY.md).
