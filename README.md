# SACC Frontend - Project Foundation

Base de projeto inicializada com a arquitetura e ferramentas conforme especificação.

## 🎯 Status: Fundação Completa

✅ Next.js 16.2 + TypeScript strict mode  
✅ Tailwind CSS 4 + shadcn/ui base  
✅ ESLint (strict rules) + Prettier  
✅ Zod para validação de env vars  
✅ Vitest + Testing Library + MSW  
✅ Clean Architecture (features + shared)  
✅ MSAL setup (Azure AD)  
✅ React Query (TanStack Query)  
✅ HTTP client com injeção de token

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
├── features/               # Features (domínio específico)
│   ├── auth/              # (placeholder)
│   ├── dashboard/         # (placeholder)
│   ├── plano-de-contas/   # (placeholder)
│   ├── destinatarios/     # (placeholder)
│   └── configuracao-alerta/ # (placeholder)
└── shared/                # Código compartilhado
    ├── auth/              # MSAL setup, useSession hook
    ├── http/              # HTTP client, MSW mocks
    ├── config/            # Env validation (Zod)
    ├── errors/            # Error types
    ├── lib/               # Utilities
    ├── types/             # Shared types
    └── ui/                # shadcn/ui components
```

## 🔧 Setup & Scripts

```bash
npm install                # Já rodado
npm run dev               # Dev server (port 3000)
npm run build             # Production build
npm run type-check        # TS strict check
npm run lint              # ESLint + Prettier
npm run lint:fix          # Auto-fix formatting
npm test                  # Vitest (watch mode)
npm run test:ui           # Vitest UI
npm run test:coverage     # Coverage report
```

## 🔐 Environment Variables

Copie `.env.example` → `.env.local` e preencha:

```
NEXT_PUBLIC_AZURE_TENANT_ID=seu-tenant-id
NEXT_PUBLIC_AZURE_CLIENT_ID=seu-client-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## ✅ Verificações Realizadas

- TypeScript strict mode: ✓ Compilando sem erros
- Linting & Formatting: ✓ Tudo padronizado
- Testes: ✓ Vitest + MSW setup funcionando
- Build: ✓ Production build bem-sucedida

## 🚀 Próximos Passos

### Marco 2: Autenticação (Azure AD / MSAL)

- Implementar tela de Login (SSO Microsoft)
- MsalAuthenticationTemplate + guard de rota
- useSession hook + logout action
- Testes de auth

### Marco 3: Plano de Contas

- Domínio: Account, Nature type
- Casos de uso (CRUD)
- Infrastructure: API client + mappers DTO
- Presentation: TanStack Table + formulários
- Testes

E assim por diante (Destinatários → Configuração do Alerta → Dashboard → Hardening).

## 📝 Notas Arquiteturais

- **Sem dados de servidor em Zustand**: React Query é a source of truth.
- **Sem `any` no TypeScript**: ESLint bloqueia; use `unknown` + narrowing.
- **Erros tipados**: DomainError, ApiError, ValidationError.
- **Validação Zod**: Schemas definem as boundaries (env, DTOs, respostas).
- **MSW para testes**: Mock Service Worker intercepta requests de teste.
- **Clean Architecture**: Features isoladas; mudanças localizadas.

---

**Pronto para começar Marco 2: Autenticação?**
