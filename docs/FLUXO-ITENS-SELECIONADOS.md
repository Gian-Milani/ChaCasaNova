# Fluxo: itens já selecionados (marcar “Já escolhido” no front)

Recapitulação de onde os dados vêm e onde podem falhar.

---

## 1. Backend (Google Sheets + Apps Script)

| Onde | O quê |
|------|--------|
| **Aba "ItensSelecionados"** | Colunas: **Cômodo** \| **NomeItem**. Uma linha por item já escolhido por alguém. |
| **GET** `?action=getItensSelecionados` | `doGet` lê essa aba e devolve um **array** de `{ comodo, nomeItem }` (JSON). |
| **Resposta** | Corpo = só o array, ex.: `[{"comodo":"lavanderia","nomeItem":"Aspirador de pó 2 em 1..."}, ...]` |

Possíveis falhas aqui:
- Aba com nome diferente ou vazia.
- URL do script errada ou deploy antigo (sem CORS).

---

## 2. Frontend: obter a lista (`bloqueados`)

| Momento | O quê |
|---------|--------|
| **Carregamento da página** | `App.jsx` chama `fetchItensSelecionados()` uma vez e guarda em `bloqueados`. |
| **Ao escolher o cômodo** | Ao mudar o combo (ex.: Lavanderia), chama de novo `fetchItensSelecionados()` e atualiza `bloqueados`. |

**Onde a requisição é feita:** `src/services/sheetsService.js` → `fetchItensSelecionados()`.

- **Em desenvolvimento:** `fetch('/api/sheets?action=getItensSelecionados')` → proxy do Vite redireciona para a URL do Apps Script (sem CORS no browser).
- **Em produção (ex.: GitHub Pages):** não há proxy. O código tenta:
  1. Proxies públicos (corsproxy.io, allorigins.win),
  2. Depois fetch direto para o Google.

Possíveis falhas aqui:
- **CORS:** em produção o fetch direto ao `script.google.com` pode ser bloqueado pelo navegador (resposta “invisível”).
- **Proxies:** podem estar fora do ar, com limite de uso ou bloqueando o domínio.
- **Resultado:** `bloqueados` fica `[]` e nenhum item aparece como “Já escolhido”.

---

## 3. Frontend: usar a lista (marcar o card)

| Onde | O quê |
|------|--------|
| **App.jsx** | Guarda `bloqueados` no state e passa para `EscolhaPresentes`. |
| **EscolhaPresentes.jsx** | Para cada item do cômodo, chama `isBloqueado(bloqueados, keyComodo, item.nome)`. |
| **ItemCard.jsx** | Se `bloqueado === true` → mostra overlay “Já escolhido” e esconde o botão de seleção. |

**Comparação (planilha vs itens.json):**
- Cômodo: comparado em minúsculas (`lavanderia` = `Lavanderia`).
- Nome: trim + colapsar espaços múltiplos; além disso usa “um contém o outro” para aceitar nomes truncados.

Possíveis falhas aqui:
- Nome na planilha diferente do nome em `itens.json` (ex.: acento, espaço a mais) e a normalização não cobrir.
- `keyComodo` não bater com o que está na planilha (ex.: chave do JSON `lavanderia` vs valor do combo “Lavanderia” — hoje isso já é tratado em minúsculas).

---

## 4. Resumo: o que fazer se ainda não marcar

1. **Confirmar que os dados chegam**
   - No app em produção, usar o modo diagnóstico (ver instruções no próprio app ou em README) para ver se “Itens já escolhidos carregados: N” mostra N > 0.
   - Se N = 0 → problema é **fetch** (CORS/proxy). Solução: usar proxy próprio (ex.: serverless na Vercel) para o GET.
   - Se N > 0 mas nada marca → problema é **comparação** (cômodo/nome). Ver planilha vs `itens.json` e ajustar normalização se precisar.

2. **Solução robusta em produção (proxy próprio)**
   - O repositório já inclui uma função serverless em `api/getItensSelecionados.js` (Vercel).
   - **Passos:**
     1. Fazer deploy deste projeto na Vercel (ou só a pasta `api` em um projeto separado).
     2. Na Vercel, configurar a variável de ambiente **GOOGLE_SCRIPT_URL** com a URL do Apps Script (ex.: `https://script.google.com/macros/s/.../exec`).
     3. Em `src/config.js`, preencher **GET_ITENS_PROXY_URL** com a URL da função (ex.: `https://seu-projeto.vercel.app/api/getItensSelecionados`).
   - Assim o front em produção chama só o proxy (sem CORS) e o proxy chama o Google no servidor.

3. **Diagnóstico no app**
   - Abrir o site em produção com **?debug=1** na URL (ex.: `https://.../ChaCasaNova/?debug=1`).
   - Uma barra no topo mostra: **"X itens carregados da planilha"** ou **"Erro — ..."**.
   - Se X = 0 ou aparece erro → o fetch está falhando (use o proxy próprio). Se X > 0 e mesmo assim nada marca → problema é na comparação dos nomes.

---

## 5. Arquivos envolvidos

| Arquivo | Papel |
|---------|--------|
| `apps-script.gs` (Google) | `doGet` com `action=getItensSelecionados` → lê aba ItensSelecionados, retorna array JSON. |
| `src/config.js` | `GOOGLE_SCRIPT_URL` (e, se houver, URL do proxy para GET). |
| `src/services/sheetsService.js` | `fetchItensSelecionados()`, `parseResposta()`, normalização. |
| `src/App.jsx` | Chama fetch no load e no refetch; state `bloqueados`. |
| `src/components/EscolhaPresentes.jsx` | `isBloqueado()`, passa `bloqueado` para cada `ItemCard`. |
| `src/components/ItemCard.jsx` | Renderiza overlay “Já escolhido” quando `bloqueado === true`. |
