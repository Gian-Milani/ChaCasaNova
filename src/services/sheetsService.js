import { GOOGLE_SCRIPT_URL } from '../config';

/**
 * Busca ao carregar a página — retorna array de itens já escolhidos.
 * GET ?action=getItensSelecionados
 * Retorna: [{ comodo: "cozinha", nomeItem: "Nome do item" }, ...]
 */
export async function fetchItensSelecionados() {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') {
    return [];
  }
  try {
    const url = `${GOOGLE_SCRIPT_URL}?action=getItensSelecionados`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Falha ao buscar itens selecionados');
    const data = await res.json();
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
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, presenca, presentes }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Erro ${res.status}`);
  try {
    const result = JSON.parse(text);
    if (result && result.success === false) throw new Error(result.error || 'Falha ao enviar');
  } catch (_) {}
}
