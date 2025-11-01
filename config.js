/**
 * Arquivo de configuração para o Gerador PTU A560
 * 
 * Este arquivo permite customizar diversos aspectos da aplicação
 */

module.exports = {
  // Diretório de saída dos arquivos gerados
  diretorioSaida: './saida',

  // Configurações padrão para novos registros
  padroes: {
    nrVerTra_PTU: '02',
    encoding: 'latin1'
  },

  // Configurações de compactação
  compactacao: {
    // Ativar/desativar compactação automática
    ativar: true,
    
    // Nível de compressão (0-9, sendo 9 o máximo)
    nivel: 9,
    
    // Remover arquivo original após compactação
    removerOriginal: true
  },

  // Configurações de log e relatório
  log: {
    // Mostrar progresso a cada N registros
    intervaloProgresso: 10,
    
    // Mostrar detalhes durante processamento
    verbose: false,
    
    // Salvar log em arquivo
    salvarLogEmArquivo: false,
    caminhoArquivoLog: './logs/processamento.log'
  },

  // Validações
  validacao: {
    // Validar CPF/CNPJ
    validarCpfCnpj: false,
    
    // Validar CEP
    validarCep: false,
    
    // Validar datas
    validarDatas: true
  },

  // Mapeamento de colunas do Excel
  // Permite customizar os nomes das colunas esperadas
  mapeamentoColunas: {
    // Exemplo: se sua planilha usa 'codigo_destino' ao invés de 'cd_Uni_Destino'
    // 'cd_Uni_Destino': 'codigo_destino'
  },

  // Formatos de data aceitos
  formatosData: [
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY'
  ]
};
