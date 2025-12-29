# PTU A560 Generator

Gerador automatizado de arquivos PTU A560 (Nota de Débito e Crédito) em lote a partir de planilhas Excel.

## Descrição

O PTU A560 Generator é uma aplicação Node.js standalone que processa planilhas Excel e gera arquivos XML no formato PTU A560 da Unimed, utilizado para notas de débito e crédito (NDC). A aplicação suporta processamento em lote, validação de dados e compactação automática dos arquivos gerados.

## Características

- **Processamento em Lote**: Processa múltiplos registros de uma única vez a partir de planilhas Excel
- **Node.js Portátil**: Inclui instalador automático do Node.js, sem necessidade de instalação prévia
- **Validação de Dados**: Validação automática de campos obrigatórios e formatos
- **Compactação ZIP**: Opção de compactar automaticamente os arquivos XML gerados
- **Geração de Hash MD5**: Cálculo automático do hash de validação conforme especificação PTU
- **Interface Interativa**: Menu interativo com validação de entradas
- **Relatórios Detalhados**: Exibição de progresso e relatório final com estatísticas
- **Tratamento de Erros**: Log detalhado de erros por linha processada
- **Configurável**: Arquivo de configuração para personalizar comportamentos

## Estrutura do Projeto

```
ptu-a560-generator/
├── src/
│   ├── index.js           # Aplicação principal
│   ├── excelProcessor.js  # Processamento de arquivos Excel
│   ├── xmlGenerator.js    # Geração de XML PTU A560
│   ├── zipCompressor.js   # Compactação de arquivos
│   └── utils.js           # Funções utilitárias
├── config.js              # Configurações da aplicação
├── dados.xlsx             # Planilha de exemplo/entrada padrão
├── instalar.bat           # Script de instalação (Windows)
├── executar.bat           # Script de execução (Windows)
├── limpar.bat             # Script de limpeza
├── package.json           # Dependências do projeto
└── README.md              # Este arquivo

Diretórios gerados:
├── node-portable/         # Node.js portátil (criado na instalação)
├── saida/                 # Arquivos XML/ZIP gerados
└── node_modules/          # Dependências npm
```

## Requisitos

- **Sistema Operacional**: Windows (scripts .bat incluídos)
- **Internet**: Necessário apenas na primeira execução para download do Node.js
- **Planilha Excel**: Arquivo .xlsx ou .xls com os dados formatados

## Instalação

### Método 1: Instalação Automática (Recomendado)

1. Clone ou baixe este repositório
2. Execute `instalar.bat`
   - O script irá baixar automaticamente o Node.js v24.11.0
   - Instalará todas as dependências necessárias
   - Não é necessário ter Node.js instalado previamente

```batch
instalar.bat
```

### Método 2: Instalação Manual

Se você já possui Node.js instalado:

```bash
npm install
```

## Uso

### Execução via Script (Recomendado)

```batch
executar.bat
```

### Execução Manual

```bash
node src/index.js
```

### Fluxo de Uso

1. **Preparar Planilha**: Coloque sua planilha `dados.xlsx` na pasta raiz do projeto
2. **Executar**: Execute `executar.bat`
3. **Interagir**: Responda às perguntas do menu interativo
4. **Verificar Saída**: Os arquivos gerados estarão na pasta `saida/`

## Formato da Planilha Excel

A planilha deve conter as seguintes colunas (primeira linha como cabeçalho):

### Cabeçalho PTU
- `nrVerTra_PTU` - Versão da transação (padrão: "02")
- `cd_Uni_Destino` - Código da Unimed de destino (4 dígitos)
- `cd_Uni_Origem` - Código da Unimed de origem (4 dígitos)
- `tp_arquivoNDC` - Tipo de arquivo NDC
- `tp_arq_parcial` - Tipo de arquivo parcial (opcional: "1" ou "2")

### Documento 1
- `nr_Doc_Cob` - Número do documento de cobrança
- `nr_Nota_Debito` - Número da nota de débito
- `dt_Emissao_NDC` - Data de emissão (formato: DD/MM/YYYY)
- `dt_Ven_NDC` - Data de vencimento
- `vl_NDC` - Valor da nota de débito
- `linha_1` até `linha_32` - Linhas descritivas da nota

### Boleto (Opcional)
- `boleto_nr_Banco` - Número do banco
- `boleto_agencia_Cd_Cedente` - Agência e código do cedente
- `boleto_nosso_Numero` - Nosso número
- `boleto_linha_digitavel` - Linha digitável
- `boleto_cd_barras` - Código de barras
- `boleto_instrucao_1` até `boleto_instrucao_3` - Instruções
- `boleto_observacao_1` até `boleto_observacao_5` - Observações

### Dados da Credora
- `credora_nm_credora` - Nome da credora
- `credora_tp_logradouro` - Tipo de logradouro (código 2 dígitos)
- `credora_ds_lograd` - Descrição do logradouro
- `credora_nr_lograd` - Número
- `credora_compl_lograd` - Complemento (opcional)
- `credora_ds_bairro` - Bairro (opcional)
- `credora_cd_munic` - Código do município
- `credora_nr_cep` - CEP
- `credora_cpf_cnpj` - CPF ou CNPJ
- `credora_nr_ddd` - DDD (opcional)
- `credora_nr_fone` - Telefone (opcional)

### Dados da Devedora
- `devedora_nm_devedora` - Nome da devedora
- `devedora_tp_logradouro` - Tipo de logradouro
- `devedora_ds_lograd` - Descrição do logradouro
- `devedora_nr_lograd` - Número
- `devedora_compl_lograd` - Complemento (opcional)
- `devedora_ds_bairro` - Bairro (opcional)
- `devedora_cd_munic` - Código do município
- `devedora_nr_cep` - CEP
- `devedora_cpf_cnpj` - CPF ou CNPJ
- `devedora_nr_ddd` - DDD (opcional)
- `devedora_nr_fone` - Telefone (opcional)

### Documento 2 (Opcional)
Utilize o prefixo `doc2_` para os mesmos campos do Documento 1, se necessário.

### Carimbo CMB (Opcional)
- `cmb_dt_postagem` - Data de postagem
- `cmb_nr_protocolo` - Número do protocolo

## Configuração

Edite o arquivo `config.js` para personalizar:

```javascript
module.exports = {
  // Diretório de saída
  diretorioSaida: './saida',

  // Compactação
  compactacao: {
    ativar: true,
    nivel: 9,
    removerOriginal: true
  },

  // Validações
  validacao: {
    validarCpfCnpj: false,
    validarCep: false,
    validarDatas: true
  }
};
```

### Opções de Configuração

- **diretorioSaida**: Diretório onde os arquivos serão salvos
- **padroes**: Valores padrão para campos opcionais
- **compactacao**: Configurações de compactação ZIP
- **log**: Configurações de logging e progresso
- **validacao**: Ativar/desativar validações específicas
- **formatosData**: Formatos de data aceitos

## Nomenclatura dos Arquivos Gerados

Os arquivos seguem o padrão PTU A560:

```
ND{tipo}_{documento}{sufixo}.{codOrigem}
```

Exemplo:
```
NDC_0001234.0234
NDC_0001234_1.0234  (arquivo parcial tipo 1)
```

## Dependências

- **inquirer**: ^8.2.5 - Interface interativa de linha de comando
- **chalk**: ^4.1.2 - Coloração de texto no terminal
- **ora**: ^5.4.1 - Spinners de carregamento
- **xlsx**: ^0.18.5 - Processamento de arquivos Excel
- **archiver**: ^5.3.1 - Compactação ZIP
- **xmlbuilder2**: 4.0.0 - Construção de documentos XML

## Scripts de Manutenção

### Limpeza

Execute `limpar.bat` para remover:
- Pasta `saida/` (arquivos gerados)
- Pasta `node_modules/`
- Pasta `node-portable/`
- Arquivo `package-lock.json`

```batch
limpar.bat
```

## Exemplos de Uso

### Exemplo 1: Processamento Básico

1. Coloque sua planilha como `dados.xlsx` na raiz
2. Execute `executar.bat`
3. Confirme o uso do arquivo padrão
4. Escolha se deseja compactar
5. Aguarde o processamento
6. Verifique os arquivos em `saida/`

### Exemplo 2: Arquivo Personalizado

1. Execute `executar.bat`
2. Selecione "Não" quando perguntado sobre o arquivo padrão
3. Digite o caminho completo da sua planilha
4. Continue o processo normalmente

## Tratamento de Erros

A aplicação oferece tratamento robusto de erros:

- **Validação de Arquivo**: Verifica se o arquivo Excel existe e é válido
- **Validação de Dados**: Valida campos obrigatórios e formatos
- **Log de Erros**: Erros são registrados com número da linha
- **Relatório Final**: Exibe estatísticas de processamento
- **Continuidade**: Erros em uma linha não interrompem o processamento das demais

## Formato de Saída

### Arquivo XML

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<ptuA560 xmlns="http://ptu.unimed.coop.br/schemas/V3_0">
  <cabecalho>
    <nrVerTra_PTU>02</nrVerTra_PTU>
    <unimed>
      <cd_Uni_Destino>0234</cd_Uni_Destino>
      <cd_Uni_Origem>0567</cd_Uni_Origem>
    </unimed>
    ...
  </cabecalho>
  <arquivoA560>
    ...
  </arquivoA560>
  <hash>a1b2c3d4e5f6...</hash>
</ptuA560>
```

### Arquivo ZIP (Opcional)

Se a compactação estiver ativada, cada XML será compactado individualmente em um arquivo .zip com o mesmo nome base.

## Solução de Problemas

### Erro: "Node.js portátil não encontrado"
**Solução**: Execute `instalar.bat` para instalar o Node.js portátil

### Erro: "Arquivo não encontrado"
**Solução**: Verifique se o caminho do arquivo Excel está correto e se o arquivo existe

### Erro: "Nenhum registro encontrado"
**Solução**: Verifique se a planilha possui dados além do cabeçalho

### Erro na linha X
**Solução**: Verifique os dados na linha indicada do Excel. O erro específico será exibido no relatório final

## Tecnologias Utilizadas

- **Node.js**: v24.11.0 (portátil)
- **JavaScript**: ES6+
- **XML**: Formato PTU A560 (Unimed)
- **Excel**: Formato .xlsx e .xls

## Limitações Conhecidas

- Scripts .bat funcionam apenas em Windows
- Encoding fixo em ISO-8859-1 (Latin1) conforme especificação PTU
- Processamento síncrono (um arquivo por vez)

## Roadmap

- [ ] Suporte para Linux/MacOS
- [ ] Interface gráfica (GUI)
- [ ] Validação avançada de CPF/CNPJ
- [ ] Exportação de logs em arquivo
- [ ] Modo batch silencioso (sem interação)
- [ ] Suporte a templates personalizados

## Versão

**1.1.0** - Versão atual

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Copyright © 2025 Wárreno Hendrick Costa Lima Guimarães.

## Autor

Wárreno Hendrick Costa Lima Guimarães

Coordenador de Contas Médicas

## Suporte

Para reportar bugs ou solicitar features, entre em contato com o desenvolvedor.

---

**Nota**: Este software é destinado ao uso interno e processamento de arquivos PTU A560 da Unimed. Certifique-se de estar em conformidade com as especificações técnicas da Unimed ao utilizar esta ferramenta.

**Feito com ❤️ para a área de Contas Médicas da Unimed Cerrado**