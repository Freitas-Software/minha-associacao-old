# Handoff reutilizável — wizard de provisionamento

Atualizado em 2026-08-23. Trabalho pausado a pedido do usuário imediatamente após a criação inicial da tela do wizard mobile, antes de formatá-la ou validá-la.

## Objetivo vigente

Executar o mapa completo de criação/provisionamento de associações, com foco inicial em API e mobile:

1. abrir o wizard logo após criar a associação;
2. permitir retomada do provisionamento;
3. enviar estatuto e ata vigente;
4. configurar e corrigir cargos;
5. definir cargo padrão e cargo(s) de acesso total;
6. indicar/convidar diretoria por CPF;
7. garantir ao menos um membro ativo com acesso total;
8. revisar pendências e ativar;
9. impedir telas operacionais enquanto a organização estiver em `PROVISIONING`;
10. permitir que destinatários criem conta/entrem e aceitem o convite.

## Regras e decisões já fixadas

- Fonte de verdade: `docs/domain/*`.
- Regras principais: `ORG-012`–`ORG-025`, `TEN-010`–`TEN-015`, `ROL-011`, `ROL-020`–`ROL-024`, `DOC-001`–`DOC-009`, `INV-001`–`INV-022`, `MBR-001`–`MBR-007`.
- A criação não torna o criador membro, dirigente ou administrador automaticamente (`ORG-009`–`ORG-011`).
- O caminho de autorização do wizard é **provisioning**, separado de membership/RBAC.
- A organização selecionada no mobile é apenas estado de UX e nunca prova de autorização.
- Convite individual é vinculado a CPF e pode apontar para cargo de diretoria/acesso total.
- Convite pendente representa um cargo de diretoria para concluir essa etapa, mas não substitui o membro ativo com acesso total exigido para ativação.
- A demonstração oficial orienta visual/cópia; as regras de domínio orientam o comportamento do provisionamento que não está demonstrado nela.
- Sem alteração de schema planejada nesta etapa; o schema atual já contém estado `PROVISIONING`, acesso temporário, cargos, memberships, convites e documentos.

## Estado concluído da API

Arquivos novos:

- `apps/api/src/modules/organizations/provisioning-access.ts`
  - guard por identidade, organização exata, estado `PROVISIONING`, acesso temporário ativo e escopo exigido;
- `apps/api/src/modules/organizations/provisioning-readiness.ts`
  - cálculo puro das pendências de documentos, cargos, diretoria e membro com acesso total;
- `apps/api/test/modules/organizations/provisioning-readiness.test.ts`
  - quatro testes de invariantes;
- `apps/api/test/modules/organizations/cnpj-registry.test.ts` já existia neste conjunto de mudanças.

Arquivos alterados:

- `apps/api/src/modules/organizations/provisioning.route.ts`
  - endpoint agregado `GET /api/organizations/:organizationId/provisioning`;
  - GET/POST de cargos protegido por escopo;
  - PATCH de cargo durante provisionamento;
  - criação de convite com validação de cargo/tenant/CPF;
  - substituição de convite individual pendente preservando histórico;
  - aceitação de convite e criação/reativação singular de membership;
  - ativação usando o mesmo cálculo de readiness;
  - encerramento de todos os acessos temporários ativos da organização após ativação;
- `apps/api/src/modules/organizations/organizations.route.ts`
  - lista combina acesso de provisionamento e membership;
  - respostas incluem `accessType: PROVISIONING | MEMBERSHIP`;
  - `/access` separa corretamente os caminhos provisioning e membership;
  - upload exige escopo institucional e valida assinatura PDF;
  - substituição de documento preenche `replaces_document_id`.

Validações já executadas e aprovadas após essas alterações:

```bash
pnpm exec biome check --write apps/api/src/modules/organizations/provisioning-access.ts apps/api/src/modules/organizations/provisioning-readiness.ts apps/api/src/modules/organizations/provisioning.route.ts apps/api/src/modules/organizations/organizations.route.ts
pnpm --filter @minha-associacao/api typecheck
pnpm --filter @minha-associacao/api exec vitest run test/modules/organizations/provisioning-readiness.test.ts test/modules/organizations/cnpj-registry.test.ts
```

Resultado: typecheck aprovado; 2 arquivos de teste e 6 testes aprovados.

## Estado atual do mobile

Dependências oficiais Expo instaladas nas versões do SDK 57:

- `expo-document-picker` `~57.0.1`;
- `expo-file-system` `~57.0.5`.

O instalador atualizou `apps/mobile/package.json`, `pnpm-workspace.yaml` e `pnpm-lock.yaml` usando catálogo pnpm.

Arquivos novos:

- `apps/mobile/src/features/provisioning/types.ts` — contrato tipado do progresso;
- `apps/mobile/src/features/provisioning/api.ts` — chamadas para progresso, upload, cargos, convites, aceite e ativação;
- `apps/mobile/src/features/provisioning/flow.ts` — ordem e primeira etapa pendente;
- `apps/mobile/src/app/(authenticated)/organizacoes/[organizacaoId]/provisionamento.tsx` — primeira implementação do wizard com:
  - progresso em quatro etapas;
  - seleção/leitura/upload de PDF;
  - criação e edição de cargos;
  - convite por CPF e cargo;
  - compartilhamento do deep link;
  - aceite do convite pela conta atual;
  - revisão e ativação.

IMPORTANTE: esses quatro arquivos mobile, principalmente a tela do wizard, **ainda não foram formatados, typechecked, lintados ou executados**. O trabalho foi pausado exatamente antes dessa validação. Assuma que podem existir erros de TypeScript/Biome e corrija com base na saída real.

## Próximos passos na ordem correta

1. Formatar e validar somente os novos arquivos mobile:

   ```bash
   pnpm exec biome check --write apps/mobile/src/features/provisioning apps/mobile/src/app/'(authenticated)'/organizacoes/'[organizacaoId]'/provisionamento.tsx
   pnpm --filter @minha-associacao/mobile typecheck
   ```

2. Corrigir os erros encontrados sem reescrever o wizard inteiro.

3. Alterar `apps/mobile/src/app/(authenticated)/organizacoes/criar.tsx` para usar a resposta do POST e executar `router.replace` para `/organizacoes/[organizacaoId]/provisionamento` quando o status for `PROVISIONING`.

4. Alterar `apps/mobile/src/app/(authenticated)/organizacoes/index.tsx`:
   - tipar `accessType`;
   - organização `PROVISIONING` + `accessType=PROVISIONING`: botão “Continuar configuração” para o wizard;
   - organização `PROVISIONING` + membership apenas: mostrar “Aguardando ativação”, sem abrir telas operacionais;
   - `OPERATIONAL` + membership: abrir `/org/[organizacaoId]`;
   - `INACTIVE`: não abrir fluxo operacional.

5. Alterar `apps/mobile/src/app/(authenticated)/org/[organizacaoId]/_layout.tsx` para consultar `/api/organizations/:id/access` antes de renderizar tabs e redirecionar `PROVISIONING` ao wizard. Não confiar no parâmetro selecionado.

6. Completar aceitação de convite por deep link:
   - criar rota pública `apps/mobile/src/app/convites/[token].tsx`;
   - registrar a tela no stack raiz;
   - se não autenticado, levar a login/criação de conta preservando `token`;
   - alterar `entrar.tsx` e `criar-conta.tsx` para voltar ao convite após autenticação;
   - se autenticado, chamar `POST /api/invitations/:token/accept` e exibir confirmação.

7. Adicionar teste de `getFirstPendingProvisioningStep` e, se viável, testes dos redirecionamentos por status.

8. Revalidar tudo:

   ```bash
   pnpm --filter @minha-associacao/api typecheck
   pnpm --filter @minha-associacao/api test
   pnpm --filter @minha-associacao/mobile typecheck
   pnpm --filter @minha-associacao/mobile test
   pnpm --filter @minha-associacao/mobile lint
   pnpm --filter @minha-associacao/mobile expo:check
   git diff --check
   ```

9. Fazer teste manual ponta a ponta com a API e o mobile em dev:
   - criar associação;
   - confirmar abertura automática do wizard;
   - enviar os dois PDFs;
   - criar cargo padrão elegível;
   - criar cargo de diretoria com acesso total;
   - convidar o próprio CPF para esse cargo e aceitar;
   - confirmar readiness completo;
   - ativar;
   - confirmar acesso às tabs operacionais e ausência de acesso temporário.

## Riscos/observações para a retomada

- O worktree já estava muito sujo antes desta etapa; vários arquivos da API e do mobile são não rastreados ou contêm mudanças anteriores do usuário. Não fazer reset/checkout e não descartar mudanças não relacionadas.
- `apps/api/src/modules/organizations/` aparece inteiro como não rastreado no Git atual; isso não significa que os arquivos possam ser substituídos indiscriminadamente.
- Não rodar migrações nem alterar schema sem uma nova análise `schema-domain-drift`; esta fase não exigiu migration.
- O endpoint agregado escolhe o documento atual como o registro mais recente de cada tipo e o upload novo aponta explicitamente para o anterior.
- Tokens de convite não são recuperáveis depois que a tela que os criou é fechada, pois somente o hash é persistido. Para reenviar após perder o token, criar convite substituto, conforme `INV-019`.
- A sessão mobile ainda é mantida apenas em memória; “retomar” após reiniciar o app exige novo login. Persistência com SecureStore continua sendo uma etapa separada do fluxo de autenticação.

## Plano no momento da pausa

- revisão de documentação/API/schema/mobile: concluída;
- API de progresso e invariantes: concluída;
- wizard mobile: em andamento;
- roteamento/bloqueio por status: pendente;
- validação integrada: pendente.
