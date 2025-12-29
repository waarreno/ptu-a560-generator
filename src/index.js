const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { lerArquivoExcel, mapearDadosParaA560, gerarNomeArquivo } = require('./excelProcessor');
const { gerarXMLPTUA560 } = require('./xmlGenerator');
const { compactarArquivo } = require('./zipCompressor');
const { criarDiretorioSeNaoExistir } = require('./utils');

/**
 * Classe principal para processamento de arquivos PTU A560
 */
class ProcessadorPTUA560 {
  constructor() {
    this.diretorioSaida = path.join(__dirname, '..', 'saida');
    this.arquivoPadrao = path.join(__dirname, '..', 'dados.xlsx');
    this.totalProcessados = 0;
    this.totalErros = 0;
    this.listaErros = [];
  }

  /**
   * Verifica se o arquivo padrão existe
   */
  arquivoPadraoExiste() {
    return fs.existsSync(this.arquivoPadrao);
  }

  /**
   * Inicia o processamento
   */
  async iniciar() {
    console.log(chalk.cyan('\n╔══════════════════════════════════════╗'));
    console.log(chalk.cyan('║    Gerador PTU A560 - Lote de NDC    ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════╝\n'));

    try {
      let arquivoEntrada;
      let compactar = true;

      // Verificar se existe arquivo padrão
      if (this.arquivoPadraoExiste()) {
        console.log(chalk.green(`✓ Arquivo padrão encontrado: dados.xlsx\n`));
        
        const respostas = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'usarPadrao',
            message: 'Deseja usar o arquivo dados.xlsx da pasta raiz?',
            default: true
          },
          {
            type: 'input',
            name: 'arquivoEntrada',
            message: 'Caminho do arquivo Excel de origem:',
            when: (answers) => !answers.usarPadrao,
            validate: (input) => {
              if (!input) return 'Por favor, informe o caminho do arquivo';
              if (!fs.existsSync(input)) return 'Arquivo não encontrado';
              if (!input.match(/\.(xlsx|xls)$/i)) return 'Arquivo deve ser .xlsx ou .xls';
              return true;
            }
          },
          {
            type: 'confirm',
            name: 'compactar',
            message: 'Deseja compactar os arquivos em ZIP?',
            default: true
          }
        ]);

        arquivoEntrada = respostas.usarPadrao ? this.arquivoPadrao : respostas.arquivoEntrada;
        compactar = respostas.compactar;
      } else {
        // Se não existir arquivo padrão, solicitar caminho
        console.log(chalk.yellow(`⚠️  Arquivo dados.xlsx não encontrado na pasta raiz\n`));
        
        const respostas = await inquirer.prompt([
          {
            type: 'input',
            name: 'arquivoEntrada',
            message: 'Caminho do arquivo Excel de origem:',
            validate: (input) => {
              if (!input) return 'Por favor, informe o caminho do arquivo';
              if (!fs.existsSync(input)) return 'Arquivo não encontrado';
              if (!input.match(/\.(xlsx|xls)$/i)) return 'Arquivo deve ser .xlsx ou .xls';
              return true;
            }
          },
          {
            type: 'confirm',
            name: 'compactar',
            message: 'Deseja compactar os arquivos em ZIP?',
            default: true
          }
        ]);

        arquivoEntrada = respostas.arquivoEntrada;
        compactar = respostas.compactar;
      }

      await this.processar(arquivoEntrada, compactar);
    } catch (erro) {
      console.error(chalk.red('\n❌ Erro na aplicação:'), erro.message);
      process.exit(1);
    }
  }

  /**
   * Processa o arquivo Excel
   * @param {string} caminhoArquivo - Caminho do arquivo Excel
   * @param {boolean} compactar - Se deve compactar em ZIP
   */
  async processar(caminhoArquivo, compactar = true) {
    const spinner = ora('Lendo arquivo Excel...').start();

    try {
      // Criar diretório de saída
      criarDiretorioSeNaoExistir(this.diretorioSaida);

      // Ler dados do Excel
      const dados = lerArquivoExcel(caminhoArquivo);
      spinner.succeed(`Arquivo lido: ${dados.length} registro(s) encontrado(s)`);

      if (dados.length === 0) {
        console.log(chalk.yellow('\n⚠️  Nenhum registro encontrado no arquivo.'));
        return;
      }

      // Processar cada linha
      console.log(chalk.cyan('\n📋 Processando registros...\n'));

      for (let i = 0; i < dados.length; i++) {
        const linha = dados[i];
        const numeroLinha = i + 2; // +2 porque linha 1 é cabeçalho e i começa em 0

        try {
          await this.processarRegistro(linha, numeroLinha, compactar);
          this.totalProcessados++;

          // Mostrar progresso registro a registro
          console.log(chalk.gray(`  Processados: ${this.totalProcessados} de ${dados.length}`));
        } catch (erro) {
          this.totalErros++;
          this.listaErros.push({
            linha: numeroLinha,
            erro: erro.message
          });
          console.log(chalk.red(`  ❌ Erro na linha ${numeroLinha}: ${erro.message}`));
        }
      }

      // Exibir relatório final
      this.exibirRelatorioFinal(dados.length);
    } catch (erro) {
      spinner.fail('Erro ao processar arquivo');
      throw erro;
    }
  }

  /**
   * Processa um registro individual
   * @param {Object} linha - Dados da linha do Excel
   * @param {number} numeroLinha - Número da linha (para log de erros)
   * @param {boolean} compactar - Se deve compactar em ZIP
   */
  async processarRegistro(linha, numeroLinha, compactar) {
    // Mapear dados para estrutura A560
    const dadosA560 = mapearDadosParaA560(linha);

    // Gerar XML
    const xml = gerarXMLPTUA560(dadosA560);

    // Gerar nome do arquivo
    const nomeArquivo = gerarNomeArquivo(dadosA560);
    const caminhoXML = path.join(this.diretorioSaida, nomeArquivo);

    // Salvar XML
    fs.writeFileSync(caminhoXML, xml, 'latin1');

    // Compactar se solicitado
    if (compactar) {
      const caminhoZip = caminhoXML.replace(/\.[^.]+$/, '.zip');
      await compactarArquivo(caminhoXML, caminhoZip);
    }
  }

  /**
   * Exibe relatório final do processamento
   * @param {number} totalRegistros - Total de registros no arquivo
   */
  exibirRelatorioFinal(totalRegistros) {
    console.log(chalk.cyan('\n╔══════════════════════════════════════╗'));
    console.log(chalk.cyan('║           Relatório Final            ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════╝\n'));

    console.log(chalk.white(`  📊 Total de registros: ${totalRegistros}`));
    console.log(chalk.green(`  ✅ Processados com sucesso: ${this.totalProcessados}`));
    console.log(chalk.red(`  ❌ Erros encontrados: ${this.totalErros}`));

    if (this.totalErros > 0) {
      console.log(chalk.yellow('\n⚠️  Detalhes dos erros:\n'));
      this.listaErros.forEach(erro => {
        console.log(chalk.red(`  • Linha ${erro.linha}: ${erro.erro}`));
      });
    }

    console.log(chalk.cyan(`\n📁 Arquivos salvos em: ${this.diretorioSaida}\n`));
  }
}

// Executar aplicação
if (require.main === module) {
  const processador = new ProcessadorPTUA560();
  processador.iniciar();
}

module.exports = ProcessadorPTUA560;