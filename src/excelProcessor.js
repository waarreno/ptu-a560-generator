const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Lê arquivo Excel e retorna os dados
 * @param {string} caminhoArquivo - Caminho do arquivo Excel
 * @returns {Array} - Array com os dados do Excel
 */
function lerArquivoExcel(caminhoArquivo) {
  if (!fs.existsSync(caminhoArquivo)) {
    throw new Error(`Arquivo não encontrado: ${caminhoArquivo}`);
  }

  const workbook = XLSX.readFile(caminhoArquivo);
  const nomePrimeiraPlanilha = workbook.SheetNames[0];
  const planilha = workbook.Sheets[nomePrimeiraPlanilha];
  
  // Converter para array de objetos (primeira linha como cabeçalho)
  const dados = XLSX.utils.sheet_to_json(planilha);
  
  return dados;
}

/**
 * Mapeia os dados do Excel para a estrutura esperada pelo gerador XML
 * @param {Object} linha - Linha do Excel
 * @returns {Object} - Dados formatados para o XML
 */
function mapearDadosParaA560(linha) {
  // Este mapeamento deve ser ajustado conforme a estrutura do seu arquivo Excel
  // O exemplo abaixo assume que as colunas A-E correspondem aos campos principais
  
  const dados = {
    // Cabeçalho
    nrVerTra_PTU: linha.nrVerTra_PTU || '02',
    cd_Uni_Destino: linha.cd_Uni_Destino,
    cd_Uni_Origem: linha.cd_Uni_Origem,
    tp_arquivoNDC: linha.tp_arquivoNDC,
    tp_arq_parcial: linha.tp_arq_parcial || '',
    
    // Documento 1
    documento1: {
      nr_Doc_Cob: linha.nr_Doc_Cob,
      notaDebito: {
        nr_Nota_Debito: linha.nr_Nota_Debito,
        dt_Emissao_NDC: linha.dt_Emissao_NDC,
        dt_Ven_NDC: linha.dt_Ven_NDC,
        vl_NDC: linha.vl_NDC,
        linhas: extrairLinhas(linha, 'linha', 32)
      },
      boleto: {
        nr_Banco: linha.boleto_nr_Banco || '',
        agencia_Cd_Cedente: linha.boleto_agencia_Cd_Cedente || '',
        nosso_Numero: linha.boleto_nosso_Numero || '',
        uso_banco: linha.boleto_uso_banco || '',
        ds_carteira: linha.boleto_ds_carteira || '',
        especie: linha.boleto_especie || '',
        especie_doc: linha.boleto_especie_doc || '',
        aceite: linha.boleto_aceite || '',
        dt_proces: linha.boleto_dt_proces || '',
        local_pgto: linha.boleto_local_pgto || '',
        obs_local_pagto: linha.boleto_obs_local_pagto || '',
        instrucoes: extrairLinhas(linha, 'boleto_instrucao', 3),
        observacoes: extrairLinhas(linha, 'boleto_observacao', 5),
        linha_digitavel: linha.boleto_linha_digitavel || '',
        cd_barras: linha.boleto_cd_barras || ''
      }
    },
    
    // Documento 2 (opcional)
    documento2: {
      nr_Doc_Cob: linha.doc2_nr_Doc_Cob || '',
      notaDebito: {
        nr_Nota_Debito: linha.doc2_nr_Nota_Debito || '',
        dt_Emissao_NDC: linha.doc2_dt_Emissao_NDC || '',
        dt_Ven_NDC: linha.doc2_dt_Ven_NDC || '',
        vl_NDC: linha.doc2_vl_NDC || '',
        linhas: extrairLinhas(linha, 'doc2_linha', 32)
      },
      boleto: {
        nr_Banco: linha.doc2_boleto_nr_Banco || '',
        agencia_Cd_Cedente: linha.doc2_boleto_agencia_Cd_Cedente || '',
        nosso_Numero: linha.doc2_boleto_nosso_Numero || '',
        uso_banco: linha.doc2_boleto_uso_banco || '',
        ds_carteira: linha.doc2_boleto_ds_carteira || '',
        especie: linha.doc2_boleto_especie || '',
        especie_doc: linha.doc2_boleto_especie_doc || '',
        aceite: linha.doc2_boleto_aceite || '',
        dt_proces: linha.doc2_boleto_dt_proces || '',
        local_pgto: linha.doc2_boleto_local_pgto || '',
        obs_local_pagto: linha.doc2_boleto_obs_local_pagto || '',
        instrucoes: extrairLinhas(linha, 'doc2_boleto_instrucao', 3),
        observacoes: extrairLinhas(linha, 'doc2_boleto_observacao', 5),
        linha_digitavel: linha.doc2_boleto_linha_digitavel || '',
        cd_barras: linha.doc2_boleto_cd_barras || ''
      }
    },
    
    // Dados da Credora
    dadosCredora: {
      nm_credora: linha.credora_nm_credora,
      endereco: {
        tp_logradouro: linha.credora_tp_logradouro,
        ds_lograd: linha.credora_ds_lograd,
        nr_lograd: linha.credora_nr_lograd,
        compl_lograd: linha.credora_compl_lograd || '',
        ds_bairro: linha.credora_ds_bairro || '',
        cd_munic: linha.credora_cd_munic,
        nr_cep: linha.credora_nr_cep
      },
      cpf_cnpj: linha.credora_cpf_cnpj,
      telefone: {
        nr_ddd: linha.credora_nr_ddd || '',
        nr_fone: linha.credora_nr_fone || ''
      }
    },
    
    // Dados da Devedora
    dadosDevedora: {
      nm_devedora: linha.devedora_nm_devedora,
      endereco: {
        tp_logradouro: linha.devedora_tp_logradouro,
        ds_lograd: linha.devedora_ds_lograd,
        nr_lograd: linha.devedora_nr_lograd,
        compl_lograd: linha.devedora_compl_lograd || '',
        ds_bairro: linha.devedora_ds_bairro || '',
        cd_munic: linha.devedora_cd_munic,
        nr_cep: linha.devedora_nr_cep
      },
      cpf_cnpj: linha.devedora_cpf_cnpj,
      telefone: {
        nr_ddd: linha.devedora_nr_ddd || '',
        nr_fone: linha.devedora_nr_fone || ''
      }
    },
    
    // Carimbo CMB (opcional)
    carimboCMB: {
      dt_postagem: linha.cmb_dt_postagem || '',
      nr_protocolo: linha.cmb_nr_protocolo || ''
    }
  };
  
  return dados;
}

/**
 * Extrai linhas numeradas do objeto
 * @param {Object} linha - Objeto com os dados
 * @param {string} prefixo - Prefixo do nome do campo
 * @param {number} quantidade - Quantidade de linhas a extrair
 * @returns {Array} - Array com as linhas
 */
function extrairLinhas(linha, prefixo, quantidade) {
  const linhas = [];
  
  for (let i = 1; i <= quantidade; i++) {
    const nomeCampo = `${prefixo}_${i}`;
    const valor = linha[nomeCampo];
    
    if (valor && String(valor).trim() !== '') {
      linhas.push(valor);
    }
  }
  
  return linhas;
}

/**
 * Gera nome do arquivo conforme padrão PTU A560
 * @param {Object} dados - Dados do registro
 * @returns {string} - Nome do arquivo
 */
function gerarNomeArquivo(dados) {
  const tipoArquivo = dados.tp_arquivoNDC;
  const documento = dados.documento1.nr_Doc_Cob;
  
  // Formatar documento (últimos 7 caracteres ou preencher com _)
  let docFormatado;
  const docStr = String(documento);
  
  if (docStr.length >= 7) {
    docFormatado = docStr.slice(-7);
  } else {
    docFormatado = '_'.repeat(7 - docStr.length) + docStr;
  }
  
  // Sufixo para arquivo parcial
  let sufixoParcial = '';
  if (dados.tp_arq_parcial && (dados.tp_arq_parcial === '1' || dados.tp_arq_parcial === '2')) {
    sufixoParcial = `_${dados.tp_arq_parcial}`;
  }
  
  // Código da Unimed de Origem
  const codUnimedOrigem = dados.cd_Uni_Origem;
  
  // Montar nome: ND{tipo}_{doc}{sufixo}.{codOrigem}
  return `ND${tipoArquivo}_${docFormatado}${sufixoParcial}.${codUnimedOrigem}`;
}

module.exports = {
  lerArquivoExcel,
  mapearDadosParaA560,
  gerarNomeArquivo
};
