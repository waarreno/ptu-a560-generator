```batch
@echo off
chcp 65001 > nul
cls

REM Verificar se o Node.js portável existe
if not exist "node-portable\node.exe" (
    echo ❌ ERRO: Node.js portátil não encontrado!
    echo.
    echo Por favor, execute 'instalar.bat' para instalação das dependências necessárias.
    echo.
    pause
    exit /b 1
)

REM Definir variáveis de ambiente
set NODE_PATH=%~dp0node-portable
set PATH=%NODE_PATH%;%PATH%

REM Verificar se as dependências estão instaladas
if not exist "node-portable\node_modules" (
    echo 📦 Instalando dependências pela primeira vez...
    echo.
    "%NODE_PATH%\node.exe" "%NODE_PATH%\npm" install --prefix "%~dp0"
    echo.
)

REM Executar a aplicação
echo 🚀 Iniciando aplicação...
echo.
"%NODE_PATH%\node.exe" "%~dp0src\index.js"

echo.
echo Versão 1.1.0
echo Copyright © 2025 Wárreno Hendrick Costa Lima Guimarães. Todos os direitos reservados.
pause
```