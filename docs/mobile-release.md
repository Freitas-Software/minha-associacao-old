# Release do aplicativo mobile

## O que cada fluxo faz

| Fluxo | Gatilho | Resultado |
| --- | --- | --- |
| `eas:development` | Manual | Builds internos com development client, no canal `development`. |
| `eas:preview` | Push em `main` com mudanca mobile ou manual | Cria build interno se o fingerprint nativo mudou; caso contrario publica update no canal `preview`. |
| `eas:production` | Tag `vX.Y.Z` ou manual, com aprovacao | Cria build de loja se o fingerprint mudou; caso contrario publica update no canal `production`. |
| `eas:submit` | Manual, com aprovacao | Envia os IDs de builds informados para Google Play e App Store Connect. |
| `eas:rollback` | Manual, com aprovacao | Republica um grupo de update validado ou volta para o bundle embarcado. |

`pnpm build` nao chama EAS e nao gera um build mobile. A exportacao local continua disponivel
como `pnpm --filter @minha-associacao/mobile export`, mas nao e um gate de CI enquanto a
exportacao nativa do Metro nao estiver estabilizada. A CI cobre o projeto mobile com
`pnpm expo:check`, lint, typecheck e testes.

## Preparacao unica no EAS

1. No painel EAS, crie os ambientes `development`, `preview` e `production`, configurando
   `EXPO_PUBLIC_API_URL` apropriada em cada um. Essa variavel fica no bundle; nao use esse
   prefixo para segredos.
2. Configure as credenciais Android e iOS para o perfil `production`. Para Android, conecte
   uma service account do Google Play; para iOS, configure a chave de App Store Connect.
3. Crie os canais `development`, `preview` e `production` se ainda nao existirem. Os perfis
   em `apps/mobile/eas.json` os associam aos builds.
4. Conecte o repositorio GitHub ao projeto EAS para que os gatilhos `push` e tags executem
   os workflows. Proteja o ambiente `production` no EAS e conceda aprovacao apenas a
   responsaveis por release.

O projeto usa `runtimeVersion.policy: fingerprint`. Uma mudanca de configuracao nativa,
dependencia nativa, plugin Expo, SDK ou codigo nativo cria um fingerprint diferente e pede
novo build. Uma alteracao somente JavaScript/asset usa o build compativel existente e vira
EAS Update.

## Publicar e submeter

Execute os comandos na raiz do monorepo:

```bash
pnpm --filter @minha-associacao/mobile eas:development
pnpm --filter @minha-associacao/mobile eas:preview
pnpm --filter @minha-associacao/mobile eas:production
```

Para uma release de producao reproduzivel, crie e envie uma tag estavel, por exemplo
`v1.2.3`. O workflow pausa na aprovacao antes de criar um build ou update de producao.
Depois de revisar o build na loja, execute `eas:submit` e informe pelo painel EAS os IDs
dos builds Android e/ou iOS.

## Rollback de update

1. Confirme no painel EAS o grupo de update que estava saudavel e o impacto da reversao.
2. Execute `eas:rollback` e escolha `republish`; informe o UUID desse grupo para republica-lo
   no canal `production`. Alternativamente escolha `embedded` para retornar ao bundle do
   ultimo build nativo.
3. Aprove o workflow, acompanhe o resultado e valide em um dispositivo com o canal
   `production` antes de encerrar o incidente.

Rollback nao altera binarios ja enviados às lojas. Se o problema estiver no codigo nativo,
publique um novo build corrigido e siga o fluxo normal de submissao.
