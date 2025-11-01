const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Compacta arquivo em formato ZIP
 * @param {string} caminhoArquivoOrigem - Caminho do arquivo a ser compactado
 * @param {string} caminhoArquivoZip - Caminho do arquivo ZIP de saída
 * @returns {Promise} - Promise que resolve quando a compactação é concluída
 */
function compactarArquivo(caminhoArquivoOrigem, caminhoArquivoZip) {
  return new Promise((resolve, reject) => {
    // Criar stream de saída
    const output = fs.createWriteStream(caminhoArquivoZip);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compressão
    });

    // Eventos
    output.on('close', () => {
      // Remover arquivo original após compactação bem-sucedida
      try {
        fs.unlinkSync(caminhoArquivoOrigem);
      } catch (err) {
        console.warn(`Aviso: Não foi possível remover arquivo original: ${err.message}`);
      }
      resolve(caminhoArquivoZip);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    // Conectar o archive ao output
    archive.pipe(output);

    // Adicionar arquivo ao ZIP
    const nomeArquivo = path.basename(caminhoArquivoOrigem);
    archive.file(caminhoArquivoOrigem, { name: nomeArquivo });

    // Finalizar
    archive.finalize();
  });
}

/**
 * Compacta múltiplos arquivos em um único ZIP
 * @param {Array} arquivos - Array com caminhos dos arquivos
 * @param {string} caminhoArquivoZip - Caminho do arquivo ZIP de saída
 * @returns {Promise} - Promise que resolve quando a compactação é concluída
 */
function compactarMultiplosArquivos(arquivos, caminhoArquivoZip) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(caminhoArquivoZip);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      // Remover arquivos originais após compactação bem-sucedida
      arquivos.forEach(arquivo => {
        try {
          fs.unlinkSync(arquivo);
        } catch (err) {
          console.warn(`Aviso: Não foi possível remover arquivo: ${arquivo}`);
        }
      });
      resolve(caminhoArquivoZip);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Adicionar todos os arquivos
    arquivos.forEach(arquivo => {
      const nomeArquivo = path.basename(arquivo);
      archive.file(arquivo, { name: nomeArquivo });
    });

    archive.finalize();
  });
}

module.exports = {
  compactarArquivo,
  compactarMultiplosArquivos
};
