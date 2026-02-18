/**
 * Google Apps Script para Chá de Casa Nova
 * Integração com Google Sheets: abas "Respostas" e "ItensSelecionados"
 *
 * Estrutura da planilha:
 * - Aba "Respostas": Timestamp | Nome | Presença | Cômodo | Item | Link Shopee (cada item = uma linha)
 * - Aba "ItensSelecionados": Cômodo | NomeItem (consultada no GET para bloquear itens já escolhidos)
 *
 * Deploy: Publicar como aplicativo de rede > Executar como: Eu | Quem acessa: Qualquer pessoa
 */

var SHEET_NAME_RESPOSTAS = 'Respostas';
var SHEET_NAME_ITENS = 'ItensSelecionados';

/**
 * Retorna headers CORS para permitir chamadas do frontend (React/Vite).
 */
function getCorsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

/**
 * Responde a requisições OPTIONS (preflight CORS).
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(getCorsHeaders());
}

/**
 * GET — Retorna todos os registros da aba "ItensSelecionados".
 * Parâmetro: action=getItensSelecionados
 * Resposta: array de objetos [{ comodo: "...", nomeItem: "..." }, ...]
 */
function doGet(e) {
  var result = { error: null, data: [] };
  try {
    if (e && e.parameter && e.parameter.action === 'getItensSelecionados') {
      var sheet = getItensSelecionadosSheet();
      var data = sheet.getDataRange().getValues();
      // Pula o cabeçalho (Cômodo | NomeItem)
      var out = [];
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][1]) {
          out.push({ comodo: String(data[i][0]).trim(), nomeItem: String(data[i][1]).trim() });
        }
      }
      result.data = out;
    } else {
      result.error = 'Parâmetro action=getItensSelecionados obrigatório';
    }
  } catch (err) {
    result.error = err.toString();
  }
  return ContentService.createTextOutput(JSON.stringify(result.data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(getCorsHeaders());
}

/**
 * POST — Recebe os dados do formulário, grava na aba "Respostas" e na aba "ItensSelecionados".
 * Body JSON: { nome: string, presenca: "sim" | "nao", presentes: [{ comodo, nomeItem, linkItem }] }
 */
function doPost(e) {
  var result = { success: false, error: null };
  try {
    var body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : null;
    if (!body || !body.nome || body.presenca === undefined || !Array.isArray(body.presentes)) {
      result.error = 'Dados inválidos: nome, presenca e presentes (array) são obrigatórios';
      return response(result);
    }

    var timestamp = new Date();
    var sheetRespostas = getRespostasSheet();
    var sheetItens = getItensSelecionadosSheet();

    // Uma linha por item na aba Respostas
    for (var i = 0; i < body.presentes.length; i++) {
      var p = body.presentes[i];
      sheetRespostas.appendRow([
        timestamp,
        body.nome,
        body.presenca,
        p.comodo || '',
        p.nomeItem || '',
        p.linkItem || ''
      ]);
    }

    // Se não escolheu nenhum item, grava pelo menos uma linha com nome e presença
    if (body.presentes.length === 0) {
      sheetRespostas.appendRow([timestamp, body.nome, body.presenca, '', '', '']);
    }

    // Atualiza a aba ItensSelecionados para bloquear itens escolhidos
    for (var j = 0; j < body.presentes.length; j++) {
      var item = body.presentes[j];
      if (item.comodo && item.nomeItem) {
        sheetItens.appendRow([item.comodo, item.nomeItem]);
      }
    }

    result.success = true;
  } catch (err) {
    result.error = err.toString();
  }
  return response(result);
}

function response(result) {
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(getCorsHeaders());
}

function getRespostasSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_RESPOSTAS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_RESPOSTAS);
    sheet.appendRow(['Timestamp', 'Nome', 'Presença', 'Cômodo', 'Item', 'Link Shopee']);
  }
  return sheet;
}

function getItensSelecionadosSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_ITENS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_ITENS);
    sheet.appendRow(['Cômodo', 'NomeItem']);
  }
  return sheet;
}
