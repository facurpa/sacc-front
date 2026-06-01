# CLAUDE.md — Arquitetura e Diretrizes do SACC Frontend

## 🎯 Contexto

SACC é um portal administrativo para gerenciar alertas contábeis. Backend é Azure Function (fora do escopo). Você constrói **apenas a UI** em Next.js + React conforme especificação em `SACC-Prompt-Agente-Frontend.md`.

**Escopo travado: 5 telas (Login, Dashboard, Plano de Contas, Destinatários, Configuração de Alerta).**

---

## 🏗️ Clean Architecture

### Regra de Dependência

- **Interna nunca depende de Externa**: `domain` não importa React, fetch, MSAL.
- **Fluxo de dependência**: `presentation` → `application` → `domain`.
- `infrastructure` **implementa** ports (interfaces) definidos em `application`/`domain`; injetado na borda.

### Estrutura por Feature

```
features/plano-de-contas/
  domain/              # Entidades, value objects, regras, erros de domínio (puro TS)
  application/         # Casos de uso + PORTS (interfaces de repositório)
  infrastructure/      # Implementação dos ports (API client, mappers DTO)
  presentation/        # Componentes React, hooks (useQuery), view-models, rotas
```

`shared/` contém:

- `auth/`: MSAL, useSession hook
- `http/`: HttpClient com token injection
- `config/`: Env (Zod)
- `errors/`: Tipos de erro padronizados
- `lib/`: Utilidades puras
- `ui/`: Componentes shadcn reutilizáveis

---

## 📝 Regras de Código

### TypeScript

- **Modo strict sempre**. Sem `any` — use `unknown` + narrowing.
- ESLint bloqueia `any` com erro. Exceção: testes (warn).
- Funcções puras; efeitos colaterais isolados.
- Nomes descritivos; sem abreviações obscuras.

### React Query + Zustand

- **React Query é source of truth para dados de servidor**. Nunca duplicar em Zustand.
- **Zustand apenas para UI state**: filtros, abertura de drawer, tema, etc.
- Suspense/skeleton para loading; toast/inline para erros.

### Erros

Tipados e tratados:

- `DomainError`: Violação de regra de negócio.
- `ApiError(status, message)`: Erro HTTP.
- `ValidationError`: Falha de validação Zod.
- Na infraestrutura: mapear erros de API para domínio. Nunca engolir silenciosamente.

### Testes

- **Unidade**: Casos de uso e regras de domínio (puro).
- **Componente**: Telas e features com Testing Library.
- **Integração**: Fluxos com API mockada via MSW.
- Mockar MSAL; não testar Azure AD real.
- Testar caminhos de erro (401, validação, rede).

---

## 🔐 Segurança

- **Autorização real é backend**. Guards de rota = apenas UX.
- **Sem segredos no bundle**: `NEXT_PUBLIC_*` são públicos (client ID, tenant, redirect URI).
- **Tokens sob MSAL**: cache em memória/sessionStorage. Nunca logar. Não expor em URL.
- **HTML sanitizado**: DOMPurify em todo editor de template (XSS).
- **Validação entrada**: Zod em **cliente** (além de servidor).

---

## 📋 Stack Obrigatório

- **Next.js 16.2 (App Router) + TypeScript strict**
- **Tailwind CSS 4 + shadcn/ui**
- **TanStack Table** (tabelas)
- **TanStack Query (React Query)** (estado de servidor)
- **Zustand** (UI state)
- **MSAL** (`@azure/msal-browser`, `@azure/msal-react`)
- **Zod** (validação)
- **Vitest + Testing Library + MSW** (testes)
- **TipTap** (editor WYSIWYG)

---

## ✅ Definição de Pronto (cada entrega)

- Compila sem erro.
- `npm run type-check`, `npm run lint` passam.
- Testes cobrindo regra de negócio + fluxos principais.
- Respeita a regra de dependência.
- Loading/erro/vazio/sucesso tratados explicitamente.
- Atende critérios de aceite da feature.
- Sem nada da lista "NÃO construir".

---

## 🚀 Plano Incremental

1. **Fundação** ✅ (Next.js, TS, Tailwind, ESLint, estrutura, Zod, Vitest, MSAL setup)
2. **Auth** (Login SSO, guard, useSession, token injection)
3. **Plano de Contas** (domínio → infra → UI → testes)
4. **Destinatários** (idem)
5. **Configuração do Alerta** (template + período + histórico inline)
6. **Dashboard** (cards, atalhos)
7. **Hardening** (CSP, session timeout, acessibilidade)

**Cada feature = fatia vertical completa (domínio → UI → testes), nunca camadas soltas.**

---

## 🔧 Comandos Principais

```bash
npm run dev              # Dev server (3000)
npm run build            # Production build
npm run type-check       # TS strict
npm run lint             # ESLint + Prettier
npm run lint:fix         # Auto-fix
npm test                 # Vitest watch
npm run test:coverage    # Coverage
```

---

## 📖 Referências

- **Especificação completa**: `SACC-Prompt-Agente-Frontend.md`
- **PRD**: `SACC-UX-UI.md`
- **Estrutura de Pastas**: Vide acima.

---

## 🎬 Instruções para Próximos Sessões

1. Leia este arquivo.
2. Confirme que `npm run type-check` e `npm test` passam.
3. Implemente a próxima feature da lista incremental.
4. Ao fim: atualizar este arquivo com lessons learned, se houver.
