import { GOOGLE_SCRIPT_URL } from '../config';

const SHEETS_BASE = import.meta.env.DEV ? '/api/sheets' : GOOGLE_SCRIPT_URL;

/** Em produção o GET é bloqueado por CORS; usar proxy público só para leitura dos itens. */
const CORS_PROXY_GET = 'https://api.allorigins.win/raw?url=';

/**
 * Busca ao carregar a página — retorna array de itens já escolhidos.
 * GET ?action=getItensSelecionados
 * Retorna: [{ comodo: "cozinha", nomeItem: "Nome do item" }, ...]
 */
export async function fetchItensSelecionados() {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') {
    return [];
  }
  const getUrl = `${GOOGLE_SCRIPT_URL}?action=getItensSelecionados`;
  const url = import.meta.env.DEV ? `${SHEETS_BASE}?action=getItensSelecionados` : CORS_PROXY_GET + encodeURIComponent(getUrl);
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Falha ao buscar itens selecionados');
    const raw = await res.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return [];
    }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.warn('fetchItensSelecionados:', err);
    return [];
  }
}

/**
 * Envia ao confirmar — salva tudo na planilha.
 * POST com body JSON: { nome, presenca, presentes }
 * presentes = array de { comodo, nomeItem, linkItem }
 */
export async function confirmarPresente({ nome, presenca, presentes }) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') {
    throw new Error('Configure a URL do Google Apps Script em src/config.js');
  }
  // Em dev usa proxy (/api/sheets) para evitar CORS; em produção usa a URL direta
  const res = await fetch(SHEETS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ nome, presenca, presentes }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Erro ${res.status}`);
  try {
    const result = JSON.parse(text);
    if (result && result.success === false) throw new Error(result.error || 'Falha ao enviar');
  } catch (_) {}
}
