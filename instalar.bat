@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Instalador Automatico do Node.js
echo ========================================
echo.

set NODE_VERSION=24.11.0
set NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip
set NODE_ZIP=node.zip
set NODE_DIR=node-portable

echo [1/4] Verificando se o Node.js ja esta instalado...
if exist "%NODE_DIR%\node.exe" (
    if exist "node_modules" (
        echo Node.js e dependencias ja estao instalados.
        echo.
        goto end
    ) else (
        echo Node.js ja esta instalado em %NODE_DIR%
        goto install_deps
    )
)

echo [2/4] Baixando Node.js v%NODE_VERSION%...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%' -UseBasicParsing}"

if not exist "%NODE_ZIP%" (
    echo ERRO: Falha ao baixar o Node.js
    exit /b 1
)

echo [3/4] Extraindo Node.js...
tar -xf "%NODE_ZIP%"

if not exist "node-v%NODE_VERSION%-win-x64" (
    echo ERRO: Falha ao extrair o Node.js
    exit /b 1
)

ren "node-v%NODE_VERSION%-win-x64" "%NODE_DIR%"
del "%NODE_ZIP%"

echo Node.js instalado com sucesso!
echo.

:install_deps
echo [4/4] Instalando dependencias do projeto (npm install)...
set PATH=%CD%\%NODE_DIR%;%PATH%

call "%NODE_DIR%\npm.cmd" install

if errorlevel 1 (
    echo ERRO: Falha ao instalar as dependencias
    exit /b 1
)

echo.
echo ========================================
echo Instalacao concluida com sucesso!
echo ========================================
echo.
echo Versao 1.1.0
echo Copyright (c) 2025 Warreno Hendrick Costa Lima Guimaraes. Todos os direitos reservados.

:end
echo Versao 1.1.0
echo Copyright (c) 2025 Warreno Hendrick Costa Lima Guimaraes. Todos os direitos reservados.
pause
