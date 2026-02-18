# Chá de Casa Nova — Tiago & Andressa 🏡

Convite interativo de chá de casa nova: confirmação de presença e escolha de presentes por cômodo.

## Stack

- React 18 + Vite
- Tailwind CSS v3
- Framer Motion
- Integração com Google Sheets (Apps Script)

## Setup

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Imagens**  
   As imagens devem ficar em `public/images/` (paths no `itens.json` são `images/xxx.jpg`).
   - `banner.jpg` — banner do topo
   - `cores.jpg` — referência de cores (paleta já aplicada no Tailwind)
   - Demais imagens dos itens (ex.: `lixeira.jpg`, `jogotoalha.jpg`, etc.)

   Se você já tem uma pasta `images/` na raiz do projeto, copie o conteúdo para `public/images/`.

   Os arquivos `comodos.json` e `itens.json` ficam na **raiz do projeto** (já existentes).

3. **Google Sheets**
   - Crie uma planilha no Google Sheets.
   - Extensões → Apps Script; cole o conteúdo de `apps-script.gs`.
   - Implante: Publicar → Implantar como aplicativo de rede → Executar como: **Eu** / Quem acessa: **Qualquer pessoa**.
   - Copie a URL e cole em `src/config.js`:
     ```js
     export const GOOGLE_SCRIPT_URL = "https://script.google.com/...";
     ```

4. **Personalizar**
   - Nomes, data, horário e local: edite os `[TODO]` em:
     - `src/components/Hero.jsx`
     - `src/components/Agradecimento.jsx`

## Desenvolvimento

```bash
npm run dev
```

## Build e deploy (GitHub Pages)

```bash
npm run build
npm run deploy
```

O `vite.config.js` está com `base: '/ChaCasaNova/'` para publicar em `https://<usuario>.github.io/ChaCasaNova/`. Ajuste o `base` se o repositório tiver outro nome.

## Checklist de comportamento

- [x] Ao carregar, faz GET no Apps Script e bloqueia itens já escolhidos
- [x] Validação de nome e confirmação de presença antes de avançar
- [x] Múltiplos itens no mesmo cômodo; troca de cômodo e sacola acumulada
- [x] Itens já escolhidos aparecem bloqueados
- [x] Após envio, itens marcados como indisponíveis localmente
- [x] Tela de agradecimento após envio
- [x] Responsivo; loading no Enviar; mensagem de erro em falha
