@echo off
echo ========================================
echo Desinstalador do Node.js e Dependencias
echo ========================================
echo.

set NODE_DIR=node-portable
set DEPS_DIR=node_modules
set LOCK_FILE=package-lock.json
set REMOVED=0

echo Verificando instalacao...
echo.

if exist "%NODE_DIR%" (
    echo Removendo Node.js ^(%NODE_DIR%^)...
    rd /s /q "%NODE_DIR%" 2>nul
    if exist "%NODE_DIR%" (
        echo ERRO: Falha ao remover %NODE_DIR%
    ) else (
        echo Node.js removido com sucesso.
        set REMOVED=1
    )
    echo.
)

if exist "%DEPS_DIR%" (
    echo Removendo dependencias ^(%DEPS_DIR%^)...
    rd /s /q "%DEPS_DIR%" 2>nul
    if exist "%DEPS_DIR%" (
        echo ERRO: Falha ao remover %DEPS_DIR%
    ) else (
        echo Dependencias removidas com sucesso.
        set REMOVED=1
    )
    echo.
)

if exist "%LOCK_FILE%" (
    echo Removendo arquivo de lock ^(%LOCK_FILE%^)...
    del /f /q "%LOCK_FILE%" 2>nul
    if exist "%LOCK_FILE%" (
        echo ERRO: Falha ao remover %LOCK_FILE%
    ) else (
        echo Arquivo de lock removido com sucesso.
        set REMOVED=1
    )
    echo.
)

if %REMOVED%==0 (
    echo Nada para remover. Node.js e dependencias nao estao instalados.
    echo.
)

echo ========================================
echo Limpeza concluida!
echo ========================================
echo.
echo Versao 1.1.0
echo Copyright (c) 2025 Warreno Hendrick Costa Lima Guimaraes. Todos os direitos reservados.
pause
