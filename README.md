# SACC Frontend

Portal administrativo para gerenciar alertas contábeis. Autenticação via **Azure AD (MSAL)** com Authorization Code + PKCE.

## Stack

- Next.js 16.2 (App Router) + TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- TanStack Query + Zustand
- MSAL (`@azure/msal-browser`, `@azure/msal-react`)
- Zod + Vitest + MSW

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base do backend FastAPI (ex.: `http://localhost:8000`) |
| `NEXT_PUBLIC_AZURE_CLIENT_ID` | Application (client) ID do **App Registration do SPA** |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Tenant ID do Azure AD |
| `NEXT_PUBLIC_AZURE_API_SCOPE` | Scope da API — formato `api://<backend-client-id>/access_as_user` |
| `NEXT_PUBLIC_AZURE_REDIRECT_URI` | URI de redirecionamento do SPA (dev: `http://localhost:3000`) |

> **Nunca commite `.env.local`** — já está no `.gitignore`.

## Configuração no Azure AD

### App Registration do SPA

1. Crie um App Registration do tipo **Single-page application**.
2. Em **Authentication → Redirect URIs**, adicione `http://localhost:3000` (e a URL de produção quando disponível).
3. Não crie client secret — SPAs usam PKCE.
4. Copie o **Application (client) ID** → `NEXT_PUBLIC_AZURE_CLIENT_ID`.

### App Registration da API (backend)

1. O backend deve ter App Registration próprio com scope exposto.
2. Em **Expose an API**, adicione o scope `access_as_user`.
3. Em **API permissions** do App Registration do SPA, conceda permissão a esse scope.
4. O scope completo (`api://<backend-client-id>/access_as_user`) vai em `NEXT_PUBLIC_AZURE_API_SCOPE`.

> **Atenção:** o scope `User.Read` (Microsoft Graph) **não funciona** para autenticar no backend — produz token com `aud` do Graph.

## Comandos

```bash
npm run dev          # Dev server em :3000
npm run build        # Build de produção
npm run type-check   # TypeScript strict
npm run lint         # ESLint + Prettier
npm test             # Vitest
```

## Smoke test manual

1. `npm run dev`
2. Acesse `http://localhost:3000` → redireciona para `/login`.
3. Clique em **Entrar com conta corporativa** → redirect para login Microsoft.
4. Após autenticar → `/dashboard`.
5. DevTools → Network: chamadas à API devem ter `Authorization: Bearer eyJ...` e **nenhum cookie de sessão**.

## Estrutura de pastas

```
src/
├── app/                      # Next.js App Router
├── features/                 # Features (domínio específico)
│   ├── auth/
│   ├── dashboard/
│   ├── plano-de-contas/
│   ├── destinatarios/
│   └── configuracao-alerta/
└── shared/
    ├── auth/                 # MSAL config, useSession, AuthGuard
    ├── http/                 # HttpClient factory, useHttpClient, MSW mocks
    ├── config/               # Validação de env (Zod)
    ├── errors/               # ApiError, DomainError, ValidationError
    ├── lib/                  # Utilitários puros
    └── ui/                   # Componentes shadcn reutilizáveis
```
