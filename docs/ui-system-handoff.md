# Sistema de design

O sistema de design do Minha Associação usa uma única fundação compartilhada:
`@minha-associacao/design-tokens`. O pacote contém contratos semânticos, foundations,
temas claro/escuro e o resolvedor da preferência `system | light | dark`.
Ele é consumido diretamente de `src` pelos bundlers para que Metro e Vite nunca carreguem
uma paleta antiga de um diretório `dist` ignorado.

As aplicações mantêm suas próprias camadas de interface:

- `apps/mobile/src/theme`, `providers`, `hooks` e `components/ui` adaptam os tokens ao
  React Native Paper para Android e iOS;
- `apps/web/src/providers`, `lib`, `styles.css` e `components/ui` adaptam os tokens ao
  shadcn/ui, Tailwind CSS e Radix para o navegador.

Não existem pacotes compartilhados de temas, componentes ou adapters de formulário. O
`form-core` continua compartilhado por ser headless; qualquer integração visual deve
ficar no aplicativo correspondente.

As telas iniciais são institucionais e deliberadamente simples enquanto os fluxos de
produto não são implementados. Mesmo nessas telas, superfícies, textos, ações e feedback
devem usar os componentes de `components/ui`; telas não devem aplicar cores de biblioteca,
hexadecimais ou fundos de plataforma diretamente.

A identidade oficial usa `#2E7D32` como verde principal, com os demais valores definidos em
`packages/design-tokens/src/foundations/colors.ts`. Os temas claro e escuro derivam dessa
paleta por papéis semânticos. Cores do React Native Paper, React Navigation, shadcn/ui e do
navegador são sempre adaptações desses papéis, nunca uma segunda fonte de verdade.
