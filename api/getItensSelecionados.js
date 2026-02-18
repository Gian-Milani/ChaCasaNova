/**
 * Proxy serverless (Vercel) para GET itens já selecionados.
 * Evita CORS em produção: o front chama esta URL em vez do Google diretamente.
 *
 * Configurar na Vercel: variável de ambiente GOOGLE_SCRIPT_URL com a URL do Apps Script (até /exec).
 * No front (config.js): GET_ITENS_PROXY_URL = "https://seu-projeto.vercel.app/api/getItensSelecionados"
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

function setCors(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    setCors(res);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const baseUrl = process.env.GOOGLE_SCRIPT_URL || '';
  if (!baseUrl) {
    setCors(res);
    return res.status(500).json({ error: 'GOOGLE_SCRIPT_URL não configurada na Vercel' });
  }

  const url = baseUrl.replace(/\/$/, '') + '?action=getItensSelecionados';

  try {
    const response = await fetch(url, { method: 'GET' });
    const text = await response.text();
    setCors(res);
    res.status(response.status).send(text);
  } catch (err) {
    setCors(res);
    res.status(502).json({ error: 'Falha ao chamar o Google Apps Script', detail: err.message });
  }
}
