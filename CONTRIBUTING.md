# Contribuindo

## Preparacao

1. Use a versao de Node indicada em `.node-version`.
2. Execute `corepack enable && corepack install`.
3. Instale as dependencias com `pnpm install`.
4. Configure os arquivos `.env` a partir dos respectivos `.env.example`.

O `pnpm-lock.yaml` faz parte de qualquer mudanca que altere dependencias. Nao use npm ou
yarn neste repositorio.

## Organizacao do monorepo

- Aplicacoes ficam em `apps/*`; codigo reutilizavel e configuracoes ficam em `packages/*`.
- Um pacote deve declarar todas as dependencias que importa, mesmo quando elas ja existem
  na raiz ou em outro workspace.
- Dependencias internas usam `workspace:*` e nao versoes publicadas ou caminhos relativos.
- Aplicacoes nao importam a implementacao de outras aplicacoes. Contratos e utilitarios
  compartilhados pertencem a um pacote interno sem dependencia de framework.
- Evite ciclos. `pnpm boundaries` deve continuar passando apos qualquer mudanca no grafo.
- Um novo workspace deve oferecer as tarefas aplicaveis do contrato raiz: `build`, `dev`,
  `lint`, `typecheck`, `test` e `test:coverage`.
- Arquivos gerados, caches, segredos e saidas de build nao devem ser versionados. Mantenha
  apenas exemplos de ambiente sem credenciais.

Execute uma tarefa em um workspace com filtro:

```bash
pnpm --filter @minha-associacao/web test
pnpm --filter @minha-associacao/api typecheck
```

Ao alterar um pacote compartilhado, valide tambem seus consumidores. O sufixo `...`
inclui as dependencias necessarias no grafo do Turborepo:

```bash
pnpm turbo run build --filter=@minha-associacao/api...
```

## Fluxo de mudanca

1. Mantenha a alteracao focada e atualize testes e documentacao afetados.
2. Use mensagens de commit curtas, no imperativo, que expliquem a intencao da mudanca.
3. Execute `pnpm verify` a partir da raiz.
4. Abra um pull request com contexto, riscos, passos de validacao e capturas para mudancas
   visuais.
5. Resolva falhas da CI sem ignorar regras ou reduzir cobertura para fazer o build passar.

O gate local completo e:

```bash
pnpm verify
```

Para diagnostico, execute separadamente `pnpm format:check`, `pnpm lint`,
`pnpm typecheck`, `pnpm test`, `pnpm check:generated`, `pnpm boundaries` e `pnpm build`.

## Seguranca

Nao inclua vulnerabilidades, tokens, dados pessoais ou credenciais em issues e pull
requests publicos. Relatos de seguranca seguem o processo descrito em
[SECURITY.md](SECURITY.md).
