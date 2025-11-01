const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Remove acentos e caracteres especiais de uma string
 * @param {string} texto - Texto a ser tratado
 * @returns {string} - Texto sem acentos e caracteres especiais
 */
function removerAcentosECaracteresEspeciais(texto) {
  if (!texto || texto.trim().length === 0) {
    return '';
  }

  let resultado = '';
  
  const mapeamentoCaracteres = {
    // Vogais maiúsculas com acento
    'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A',
    'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
    'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
    'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
    'Ç': 'C', 'Ñ': 'N',
    
    // Vogais minúsculas com acento
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c', 'ñ': 'n',
    
    // Caracteres especiais
    'º': '', 'ª': '', '°': ' graus',
    '¹': '', '²': '', '³': '',
    '&': 'e',
    '<': '', '>': '', '"': '', "'": '', '"': '', '"': '',
    '@': 'at',
    '\\': '/',
    '^': '', '~': '', '´': '', '`': '', '¨': ''
  };

  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];
    
    if (mapeamentoCaracteres[caracter]) {
      resultado += mapeamentoCaracteres[caracter];
    } else {
      // Verificar se o caractere é válido (ASCII entre 32 e 126)
      const codigoAscii = caracter.charCodeAt(0);
      if (codigoAscii >= 32 && codigoAscii <= 126) {
        resultado += caracter;
      }
    }
  }

  return resultado;
}

/**
 * Calcula hash MD5 de uma string
 * @param {string} texto - Texto para calcular o hash
 * @returns {string} - Hash MD5 em hexadecimal (lowercase)
 */
function calcularMD5Hash(texto) {
  const buffer = Buffer.from(texto, 'latin1');
  const hash = crypto.createHash('md5');
  hash.update(buffer);
  return hash.digest('hex').toLowerCase();
}

/**
 * Formata número com zeros à esquerda
 * @param {number|string} valor - Valor a ser formatado
 * @param {number} tamanho - Tamanho total desejado
 * @returns {string} - Valor formatado com zeros à esquerda
 */
function formatarComZeros(valor, tamanho) {
  return String(valor).padStart(tamanho, '0');
}

/**
 * Formata data no formato YYYYMMDD
 * @param {Date|string|number} data - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatarData(data) {
  if (!data) return '';
  
  let dataObj;
  
  // Se já é um objeto Date
  if (data instanceof Date) {
    dataObj = data;
  }
  // Se é uma string no formato DD/MM/YYYY (comum do Excel)
  else if (typeof data === 'string' && data.includes('/')) {
    const partes = data.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Mês é base 0 no JavaScript
      const ano = parseInt(partes[2], 10);
      dataObj = new Date(ano, mes, dia);
    } else {
      dataObj = new Date(data);
    }
  }
  // Se é uma string no formato YYYY-MM-DD
  else if (typeof data === 'string' && data.includes('-')) {
    dataObj = new Date(data);
  }
  // Se é um número (serial do Excel)
  else if (typeof data === 'number') {
    // Excel usa 1899-12-30 como data base (serial 0)
    const dataBase = new Date(1899, 11, 30);
    dataObj = new Date(dataBase.getTime() + data * 24 * 60 * 60 * 1000);
  }
  // Tentar converter diretamente
  else {
    dataObj = new Date(data);
  }
  
  // Validar se a data é válida
  if (isNaN(dataObj.getTime())) {
    console.warn(`Aviso: Data inválida encontrada: ${data}`);
    return '';
  }
  
  const ano = dataObj.getFullYear();
  const mes = formatarComZeros(dataObj.getMonth() + 1, 2);
  const dia = formatarComZeros(dataObj.getDate(), 2);
  
  return `${ano}${mes}${dia}`;
}

/**
 * Formata valor monetário (substitui vírgula por ponto)
 * @param {number|string} valor - Valor a ser formatado
 * @returns {string} - Valor formatado
 */
function formatarValorMonetario(valor) {
  if (!valor) return '0.00';
  
  const valorNum = typeof valor === 'number' ? valor : parseFloat(String(valor).replace(',', '.'));
  return valorNum.toFixed(2);
}

/**
 * Formata o documento para o nome do arquivo (últimos 7 caracteres ou preenche com _)
 * @param {string} documento - Número do documento
 * @returns {string} - Documento formatado
 */
function formatarDocumentoParaNomeArquivo(documento) {
  if (!documento) return '_______';
  
  const docStr = String(documento);
  
  if (docStr.length >= 7) {
    return docStr.slice(-7);
  } else {
    return '_'.repeat(7 - docStr.length) + docStr;
  }
}

/**
 * Verifica se um valor está vazio ou nulo
 * @param {any} valor - Valor a ser verificado
 * @returns {boolean}
 */
function isVazio(valor) {
  return valor === null || valor === undefined || String(valor).trim() === '';
}

/**
 * Cria diretório se não existir
 * @param {string} dirPath - Caminho do diretório
 */
function criarDiretorioSeNaoExistir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = {
  removerAcentosECaracteresEspeciais,
  calcularMD5Hash,
  formatarComZeros,
  formatarData,
  formatarValorMonetario,
  formatarDocumentoParaNomeArquivo,
  isVazio,
  criarDiretorioSeNaoExistir
};
