# Proxy em produção (itens já selecionados)

Em produção (ex.: GitHub Pages), o navegador bloqueia a resposta do Google Apps Script por **CORS**. Por isso a lista de itens já escolhidos pode não carregar e nenhum item aparece como "Já escolhido".

A solução é usar um **proxy serverless** que chama o Google no servidor e devolve o JSON para o front.

## Opção: Vercel

O projeto já inclui a função em `api/getItensSelecionados.js`.

### 1. Deploy na Vercel

- Conecte este repositório à [Vercel](https://vercel.com).
- No deploy, configure:
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Variável de ambiente:** `GOOGLE_SCRIPT_URL` = URL do seu Apps Script (a mesma que está em `src/config.js`, até `/exec`).

Se quiser usar a Vercel **só para o proxy** (e manter o site no GitHub Pages):

- Crie um projeto na Vercel com **Root Directory** = `api` (ou um repo que só tenha essa função).
- Configure só a variável `GOOGLE_SCRIPT_URL`.
- A URL da função será algo como: `https://seu-projeto.vercel.app/api/getItensSelecionados`.

### 2. Configurar o frontend

Em `src/config.js`, preencha o proxy:

```js
export const GET_ITENS_PROXY_URL = "https://seu-projeto.vercel.app/api/getItensSelecionados";
```

Faça o build e o deploy do front de novo (ex.: `npm run deploy` para GitHub Pages).

A partir daí, em produção o app vai usar essa URL para buscar os itens já selecionados e os cards "Já escolhido" devem aparecer corretamente.

## Conferir

Abra o site em produção com **?debug=1** na URL. No topo deve aparecer algo como:

- **"4 itens carregados da planilha"** → fetch ok; os itens da planilha devem marcar.
- **"Erro — ..."** → ainda há falha (confira URL do proxy e variável na Vercel).
