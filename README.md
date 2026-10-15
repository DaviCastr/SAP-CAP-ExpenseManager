# Expense Manager - CAP

Backend do [Expense Manager](https://davicastr.github.io/SAP-UI5-ExpenseManager/) em SAP CAP (TypeScript), com SAP HANA Cloud e XSUAA. O front-end UI5 fica em [SAP-UI5-ExpenseManager](https://github.com/DaviCastr/SAP-UI5-ExpenseManager) e chama o serviço `/service/ExpenseManager/` diretamente (sem approuter); o fluxo de login está em [docs/authentication-flow.md](docs/authentication-flow.md).

## Desenvolvimento local

```bash
npm install
npx cds-tsx watch       # http://localhost:4004
```

Usuários locais (basic auth): `davi / 123456` e `beatriz / 123456`.

| Endpoint | Descrição |
|---|---|
| `/service/ExpenseManager/` | Serviço OData V4 (exige login) |
| `/health` | Health check padrão do CAP |
| `/health/db` | Público; responde `UP` quando o banco está acessível e `503` quando o HANA está parado |

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Servidor, porta (padrão 587), email e senha de app usados no envio de emails |

## Deploy no BTP Trial

```bash
npm run bd
cf deploy mta_archives/ExpenseManager_1.0.0.mtar
```

Depois atribua a role collection `ExpenseManager_User` ao seu usuário no cockpit (Security > Users).

No trial o HANA Cloud é parado toda noite. Dois workflows cuidam do ambiente:

| Workflow | Quando roda | O que faz |
|---|---|---|
| [Start BTP trial](.github/workflows/start-trial.yml) | 15:13, 17:13, 19:13, 20:13, 21:13 e 00:13 (Brasília) e sob demanda | Se `/health/db` já responde, termina sem fazer nada; caso contrário inicia o HANA Cloud, reinicia o `ExpenseManager-srv` e confere se o banco responde. Os horários repetidos compensam os atrasos dos agendamentos do GitHub |
| [Setup BTP trial](.github/workflows/setup-trial.yml) | Manual (conta nova ou novo deploy) | Inicia o HANA se estiver parado e executa as etapas escolhidas: build e deploy do MTA, configuração do SMTP e atualização do `webapp/config/runtime-config.json` do UI5 (URL do CAP e `url`, `clientid` e `xsappname` do XSUAA), com commit que publica o GitHub Pages |

| Configuração (Settings > Secrets and variables > Actions) | Tipo | Valor |
|---|---|---|
| `CF_USERNAME` | Secret | Email do usuário do BTP |
| `CF_PASSWORD` | Secret | Senha do usuário do BTP |
| `UI5_REPO_TOKEN` | Secret | Fine-grained token com *Contents: Read and write* no repositório do UI5 |
| `SMTP_PASSWORD` | Secret | Senha de app do Gmail |
| `CF_ORG` | Variable | Org do Cloud Foundry (ex.: `d4e1c97ctrial`) |
| `SMTP_USER` | Variable | Email que envia as mensagens |
| `CF_API` | Variable | Opcional, padrão `https://api.cf.us10-001.hana.ondemand.com` |
| `CF_SPACE` | Variable | Opcional, padrão `dev` |
| `CF_APP` | Variable | Opcional, padrão `ExpenseManager-srv` |
| `HANA_INSTANCE` | Variable | Opcional; sem ela o workflow usa a primeira instância `hana-cloud*` do space |
| `SMTP_HOST` / `SMTP_PORT` | Variable | Opcionais, padrão `smtp.gmail.com` / `587` |
| `UAA_INSTANCE` / `UAA_KEY` | Variable | Opcionais, padrão `ExpenseManager-uaa` / `ExpenseManager-uaa-key` |
| `UI5_REPOSITORY` / `UI5_PAGES_URL` | Variable | Opcionais, padrão `DaviCastr/SAP-UI5-ExpenseManager` / `https://davicastr.github.io/SAP-UI5-ExpenseManager/` (usado como redirect do login) |

Ao recriar a conta trial: crie a instância do SAP HANA Cloud, atualize `CF_ORG` (e `CF_API`, se a região mudar), rode **Setup BTP trial** com todas as etapas e atribua a role collection `ExpenseManager_User` ao seu usuário no cockpit.

O GitHub desativa workflows agendados em repositórios sem atividade por 60 dias; nesse caso basta reativá-lo na aba Actions.
