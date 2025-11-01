const { create } = require('xmlbuilder2');
const {
  removerAcentosECaracteresEspeciais,
  calcularMD5Hash,
  formatarComZeros,
  formatarData,
  formatarValorMonetario,
  isVazio
} = require('./utils');

/**
 * Gera o XML PTU A560
 * @param {Object} dados - Dados do registro
 * @returns {string} - XML gerado
 */
function gerarXMLPTUA560(dados) {
  // Criar documento XML
  const root = create({ version: '1.0', encoding: 'ISO-8859-1' })
    .ele('ptuA560', { xmlns: 'http://ptu.unimed.coop.br/schemas/V3_0' });

  // Cabeçalho
  const cabecalho = root.ele('cabecalho');
  adicionarElemento(cabecalho, 'nrVerTra_PTU', formatarComZeros(dados.nrVerTra_PTU, 2));

  const unimed = cabecalho.ele('unimed');
  adicionarElemento(unimed, 'cd_Uni_Destino', formatarComZeros(dados.cd_Uni_Destino, 4));
  adicionarElemento(unimed, 'cd_Uni_Origem', formatarComZeros(dados.cd_Uni_Origem, 4));

  adicionarElemento(cabecalho, 'tp_arquivoNDC', dados.tp_arquivoNDC);

  if (!isVazio(dados.tp_arq_parcial)) {
    adicionarElemento(cabecalho, 'tp_arq_parcial', dados.tp_arq_parcial);
  }

  // ArquivoA560
  const arquivoA560 = root.ele('arquivoA560');

  // Documento1
  const documento1 = arquivoA560.ele('Documento1');
  adicionarElemento(documento1, 'nr_Doc_Cob', dados.documento1.nr_Doc_Cob);

  // Nota de Débito 1
  const notaDebito = documento1.ele('Nota_Debito');
  adicionarElemento(notaDebito, 'nr_Nota_Debito', dados.documento1.notaDebito.nr_Nota_Debito);
  adicionarElemento(notaDebito, 'dt_Emissao_NDC', formatarData(dados.documento1.notaDebito.dt_Emissao_NDC));
  adicionarElemento(notaDebito, 'dt_Ven_NDC', formatarData(dados.documento1.notaDebito.dt_Ven_NDC));
  adicionarElemento(notaDebito, 'vl_NDC', formatarValorMonetario(dados.documento1.notaDebito.vl_NDC));

  // Linhas da nota de débito
  if (dados.documento1.notaDebito.linhas) {
    dados.documento1.notaDebito.linhas.forEach((linha, index) => {
      if (!isVazio(linha)) {
        const linhaNode = notaDebito.ele('Linha');
        adicionarElemento(linhaNode, 'nr_Linha', formatarComZeros(index + 1, 2));
        adicionarElemento(linhaNode, 'ds_linha', linha);
      }
    });
  }

  // Boleto 1 (opcional)
  if (dados.documento1.boleto && !isVazio(dados.documento1.boleto.nr_Banco)) {
    const boleto = documento1.ele('Boleto');
    adicionarElemento(boleto, 'nr_Banco', dados.documento1.boleto.nr_Banco);
    adicionarElemento(boleto, 'agencia_Cd_Cedente', dados.documento1.boleto.agencia_Cd_Cedente);
    adicionarElemento(boleto, 'nosso_Numero', dados.documento1.boleto.nosso_Numero);

    // Campos opcionais do boleto
    if (!isVazio(dados.documento1.boleto.uso_banco)) {
      adicionarElemento(boleto, 'uso_banco', dados.documento1.boleto.uso_banco);
    }
    if (!isVazio(dados.documento1.boleto.ds_carteira)) {
      adicionarElemento(boleto, 'ds_carteira', dados.documento1.boleto.ds_carteira);
    }
    if (!isVazio(dados.documento1.boleto.especie)) {
      adicionarElemento(boleto, 'especie', dados.documento1.boleto.especie);
    }
    if (!isVazio(dados.documento1.boleto.especie_doc)) {
      adicionarElemento(boleto, 'especie_doc', dados.documento1.boleto.especie_doc);
    }
    if (!isVazio(dados.documento1.boleto.aceite)) {
      adicionarElemento(boleto, 'aceite', dados.documento1.boleto.aceite);
    }
    if (!isVazio(dados.documento1.boleto.dt_proces)) {
      adicionarElemento(boleto, 'dt_proces', dados.documento1.boleto.dt_proces);
    }

    adicionarElemento(boleto, 'local_pgto', dados.documento1.boleto.local_pgto);
    adicionarElemento(boleto, 'obs_local_pagto', dados.documento1.boleto.obs_local_pagto);

    // Instruções (até 3)
    if (dados.documento1.boleto.instrucoes) {
      dados.documento1.boleto.instrucoes.forEach(instrucao => {
        if (!isVazio(instrucao)) {
          adicionarElemento(boleto, 'ds_instrucao', instrucao);
        }
      });
    }

    // Observações (até 5, opcionais)
    if (dados.documento1.boleto.observacoes) {
      dados.documento1.boleto.observacoes.forEach(observacao => {
        if (!isVazio(observacao)) {
          adicionarElemento(boleto, 'ds_observacao', observacao);
        }
      });
    }

    adicionarElemento(boleto, 'linha_digitavel', dados.documento1.boleto.linha_digitavel);
    adicionarElemento(boleto, 'cd_barras', dados.documento1.boleto.cd_barras);
  }

  // Documento2 (opcional)
  if (dados.documento2 && !isVazio(dados.documento2.nr_Doc_Cob)) {
    const documento2 = arquivoA560.ele('Documento2');
    adicionarElemento(documento2, 'nr_Doc_Cob', dados.documento2.nr_Doc_Cob);

    // Nota de Débito 2
    if (dados.documento2.notaDebito && !isVazio(dados.documento2.notaDebito.nr_Nota_Debito)) {
      const notaDebito2 = documento2.ele('Nota_Debito');
      adicionarElemento(notaDebito2, 'nr_Nota_Debito', dados.documento2.notaDebito.nr_Nota_Debito);
      adicionarElemento(notaDebito2, 'dt_Emissao_NDC', formatarData(dados.documento2.notaDebito.dt_Emissao_NDC));
      adicionarElemento(notaDebito2, 'dt_Ven_NDC', formatarData(dados.documento2.notaDebito.dt_Ven_NDC));
      adicionarElemento(notaDebito2, 'vl_NDC', formatarValorMonetario(dados.documento2.notaDebito.vl_NDC));

      // Linhas da nota de débito 2
      if (dados.documento2.notaDebito.linhas) {
        dados.documento2.notaDebito.linhas.forEach((linha, index) => {
          if (!isVazio(linha)) {
            const linhaNode = notaDebito2.ele('Linha');
            adicionarElemento(linhaNode, 'nr_Linha', formatarComZeros(index + 1, 2));
            adicionarElemento(linhaNode, 'ds_linha', linha);
          }
        });
      }
    }

    // Boleto 2 (opcional)
    if (dados.documento2.boleto && !isVazio(dados.documento2.boleto.nr_Banco)) {
      const boleto2 = documento2.ele('Boleto');
      adicionarElemento(boleto2, 'nr_Banco', dados.documento2.boleto.nr_Banco);
      adicionarElemento(boleto2, 'agencia_Cd_Cedente', dados.documento2.boleto.agencia_Cd_Cedente);
      adicionarElemento(boleto2, 'nosso_Numero', dados.documento2.boleto.nosso_Numero);

      // Campos opcionais do boleto 2
      if (!isVazio(dados.documento2.boleto.uso_banco)) {
        adicionarElemento(boleto2, 'uso_banco', dados.documento2.boleto.uso_banco);
      }
      if (!isVazio(dados.documento2.boleto.ds_carteira)) {
        adicionarElemento(boleto2, 'ds_carteira', dados.documento2.boleto.ds_carteira);
      }
      if (!isVazio(dados.documento2.boleto.especie)) {
        adicionarElemento(boleto2, 'especie', dados.documento2.boleto.especie);
      }
      if (!isVazio(dados.documento2.boleto.especie_doc)) {
        adicionarElemento(boleto2, 'especie_doc', dados.documento2.boleto.especie_doc);
      }
      if (!isVazio(dados.documento2.boleto.aceite)) {
        adicionarElemento(boleto2, 'aceite', dados.documento2.boleto.aceite);
      }
      if (!isVazio(dados.documento2.boleto.dt_proces)) {
        adicionarElemento(boleto2, 'dt_proces', dados.documento2.boleto.dt_proces);
      }

      adicionarElemento(boleto2, 'local_pgto', dados.documento2.boleto.local_pgto);
      adicionarElemento(boleto2, 'obs_local_pagto', dados.documento2.boleto.obs_local_pagto);

      // Instruções
      if (dados.documento2.boleto.instrucoes) {
        dados.documento2.boleto.instrucoes.forEach(instrucao => {
          if (!isVazio(instrucao)) {
            adicionarElemento(boleto2, 'ds_instrucao', instrucao);
          }
        });
      }

      // Observações
      if (dados.documento2.boleto.observacoes) {
        dados.documento2.boleto.observacoes.forEach(observacao => {
          if (!isVazio(observacao)) {
            adicionarElemento(boleto2, 'ds_observacao', observacao);
          }
        });
      }

      adicionarElemento(boleto2, 'linha_digitavel', dados.documento2.boleto.linha_digitavel);
      adicionarElemento(boleto2, 'cd_barras', dados.documento2.boleto.cd_barras);
    }
  }

  // Dados da Credora
  const dadosCredora = arquivoA560.ele('Dados_Credora');
  adicionarElemento(dadosCredora, 'nm_credora', dados.dadosCredora.nm_credora);

  const infoEnderecoCredora = dadosCredora.ele('info_endereco');
  adicionarElemento(infoEnderecoCredora, 'tp_logradouro', formatarComZeros(dados.dadosCredora.endereco.tp_logradouro, 2));
  adicionarElemento(infoEnderecoCredora, 'ds_lograd', dados.dadosCredora.endereco.ds_lograd);
  adicionarElemento(infoEnderecoCredora, 'nr_lograd', dados.dadosCredora.endereco.nr_lograd);

  if (!isVazio(dados.dadosCredora.endereco.compl_lograd)) {
    adicionarElemento(infoEnderecoCredora, 'compl_lograd', dados.dadosCredora.endereco.compl_lograd);
  }
  if (!isVazio(dados.dadosCredora.endereco.ds_bairro)) {
    adicionarElemento(infoEnderecoCredora, 'ds_bairro', dados.dadosCredora.endereco.ds_bairro);
  }

  adicionarElemento(infoEnderecoCredora, 'cd_munic', dados.dadosCredora.endereco.cd_munic);
  adicionarElemento(infoEnderecoCredora, 'nr_cep', dados.dadosCredora.endereco.nr_cep);

  const cpfCnpjCredora = dadosCredora.ele('cpf_cnpj');
  if (String(dados.dadosCredora.cpf_cnpj).length === 11) {
    adicionarElemento(cpfCnpjCredora, 'cd_cpf', dados.dadosCredora.cpf_cnpj);
  } else {
    adicionarElemento(cpfCnpjCredora, 'cd_cnpj', dados.dadosCredora.cpf_cnpj);
  }

  if (!isVazio(dados.dadosCredora.telefone?.nr_ddd) && !isVazio(dados.dadosCredora.telefone?.nr_fone)) {
    const telefoneCredora = dadosCredora.ele('telefone');
    adicionarElemento(telefoneCredora, 'nr_ddd', dados.dadosCredora.telefone.nr_ddd);
    adicionarElemento(telefoneCredora, 'nr_fone', dados.dadosCredora.telefone.nr_fone);
  }

  // Dados da Devedora
  const dadosDevedora = arquivoA560.ele('Dados_Devedora');
  adicionarElemento(dadosDevedora, 'nm_devedora', dados.dadosDevedora.nm_devedora);

  const infoEnderecoDevedora = dadosDevedora.ele('info_endereco');
  adicionarElemento(infoEnderecoDevedora, 'tp_logradouro', formatarComZeros(dados.dadosDevedora.endereco.tp_logradouro, 2));
  adicionarElemento(infoEnderecoDevedora, 'ds_lograd', dados.dadosDevedora.endereco.ds_lograd);
  adicionarElemento(infoEnderecoDevedora, 'nr_lograd', dados.dadosDevedora.endereco.nr_lograd);

  if (!isVazio(dados.dadosDevedora.endereco.compl_lograd)) {
    adicionarElemento(infoEnderecoDevedora, 'compl_lograd', dados.dadosDevedora.endereco.compl_lograd);
  }
  if (!isVazio(dados.dadosDevedora.endereco.ds_bairro)) {
    adicionarElemento(infoEnderecoDevedora, 'ds_bairro', dados.dadosDevedora.endereco.ds_bairro);
  }

  adicionarElemento(infoEnderecoDevedora, 'cd_munic', dados.dadosDevedora.endereco.cd_munic);
  adicionarElemento(infoEnderecoDevedora, 'nr_cep', dados.dadosDevedora.endereco.nr_cep);

  const cpfCnpjDevedora = dadosDevedora.ele('cpf_cnpj');
  if (String(dados.dadosDevedora.cpf_cnpj).length === 11) {
    adicionarElemento(cpfCnpjDevedora, 'cd_cpf', dados.dadosDevedora.cpf_cnpj);
  } else {
    adicionarElemento(cpfCnpjDevedora, 'cd_cnpj', dados.dadosDevedora.cpf_cnpj);
  }

  if (!isVazio(dados.dadosDevedora.telefone?.nr_ddd) && !isVazio(dados.dadosDevedora.telefone?.nr_fone)) {
    const telefoneDevedora = dadosDevedora.ele('telefone');
    adicionarElemento(telefoneDevedora, 'nr_ddd', dados.dadosDevedora.telefone.nr_ddd);
    adicionarElemento(telefoneDevedora, 'nr_fone', dados.dadosDevedora.telefone.nr_fone);
  }

  // Calcular hash
  const xmlString = obterStringLinearXML(root);
  const hashMD5 = calcularMD5Hash(xmlString);
  adicionarElemento(root, 'hash', hashMD5);

  // Carimbo CMB (opcional)
  if (!isVazio(dados.carimboCMB?.dt_postagem) && !isVazio(dados.carimboCMB?.nr_protocolo)) {
    const carimboCMB = root.ele('carimboCMB');
    adicionarElemento(carimboCMB, 'dt_postagem', dados.carimboCMB.dt_postagem);
    adicionarElemento(carimboCMB, 'nr_protocolo', dados.carimboCMB.nr_protocolo);
  }

  // Gerar XML como string
  const xml = root.end({ prettyPrint: true });
  
  return xml;
}

/**
 * Adiciona elemento ao nó pai com tratamento de caracteres especiais
 * @param {Object} nodeParent - Nó pai
 * @param {string} elementName - Nome do elemento
 * @param {string} elementValue - Valor do elemento
 */
function adicionarElemento(nodeParent, elementName, elementValue) {
  const valorTratado = removerAcentosECaracteresEspeciais(String(elementValue || ''));
  nodeParent.ele(elementName).txt(valorTratado);
}

/**
 * Obtém string linear do XML (concatena todos os valores de texto)
 * @param {Object} rootNode - Nó raiz do XML
 * @returns {string} - String linear com todos os valores
 */
function obterStringLinearXML(rootNode) {
  const xml = rootNode.end({ prettyPrint: false });
  
  // Extrair apenas os valores entre tags (sem os nomes das tags)
  const valores = xml.match(/>([^<]+)</g);
  
  if (!valores) return '';
  
  return valores.map(v => v.replace(/>/g, '').replace(/</g, '')).join('');
}

module.exports = {
  gerarXMLPTUA560
};
