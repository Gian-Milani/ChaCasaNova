import { GOOGLE_SCRIPT_URL } from '../config';

const SHEETS_BASE = import.meta.env.DEV ? '/api/sheets' : GOOGLE_SCRIPT_URL;

const GET_URL = `${GOOGLE_SCRIPT_URL}?action=getItensSelecionados`;

/** Normaliza itens da planilha para comparação consistente (comodo em minúsculo, nomeItem trim). */
function normalizarBloqueados(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((b) => ({
    comodo: (b.comodo || '').toLowerCase().trim(),
    nomeItem: (b.nomeItem || '').trim(),
  })).filter((b) => b.comodo && b.nomeItem);
}

function parseResposta(raw) {
  let data;
  try {
    data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  return normalizarBloqueados(arr);
}

/**
 * Busca ao carregar a página — retorna array de itens já escolhidos.
 * GET ?action=getItensSelecionados
 * Em produção tenta direto e depois proxy (CORS bloqueia resposta do Google).
 */
export async function fetchItensSelecionados() {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') {
    return [];
  }

  if (import.meta.env.DEV) {
    try {
      const res = await fetch(`${SHEETS_BASE}?action=getItensSelecionados`, { method: 'GET' });
      if (!res.ok) return [];
      const raw = await res.text();
      return parseResposta(raw);
    } catch (err) {
      console.warn('fetchItensSelecionados:', err);
      return [];
    }
  }

  // Produção: tentar direto (em alguns contextos pode funcionar), depois proxy
  try {
    const res = await fetch(GET_URL, { method: 'GET' });
    if (res.ok) {
      const raw = await res.text();
      return parseResposta(raw);
    }
  } catch (_) {}

  const proxies = [
    () => fetch(`https://corsproxy.io/?${encodeURIComponent(GET_URL)}`).then((r) => r.text()),
    () => fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(GET_URL)}`).then((r) => r.json()).then((d) => d.contents || ''),
    () => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(GET_URL)}`).then((r) => r.text()),
  ];

  for (const proxyFetch of proxies) {
    try {
      const raw = await proxyFetch();
      const parsed = parseResposta(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
  }

  return [];
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
