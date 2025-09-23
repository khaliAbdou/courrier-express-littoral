@echo off
setlocal enabledelayedexpansion

REM Script de build automatisé pour ANOR Desktop (Tauri) - Windows
REM Usage: build-tauri.bat [dev|build|debug]

echo 🚀 ANOR Desktop - Build Tauri
echo ================================
echo.

REM Fonction pour vérifier les prérequis
:check_prerequisites
echo ℹ️  Vérification des prérequis...

REM Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js non trouvé. Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js trouvé: %%i

REM Vérifier npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm non trouvé.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm trouvé: %%i

REM Vérifier Rust
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust non trouvé. Installez Rust depuis https://rustup.rs/
    echo.
    echo Après installation de Rust, redémarrez cette console.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('rustc --version') do echo ✅ Rust trouvé: %%i

REM Vérifier Cargo
cargo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Cargo non trouvé.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('cargo --version') do echo ✅ Cargo trouvé: %%i

REM Vérifier Tauri CLI
tauri --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Tauri CLI non trouvé. Installation...
    npm install -g @tauri-apps/cli@latest
    if %errorlevel% neq 0 (
        echo ❌ Échec de l'installation de Tauri CLI
        pause
        exit /b 1
    )
    echo ✅ Tauri CLI installé avec succès
) else (
    for /f "tokens=*" %%i in ('tauri --version') do echo ✅ Tauri CLI trouvé: %%i
)

echo.
goto install_dependencies

:install_dependencies
echo ℹ️  Installation des dépendances...
npm install
if %errorlevel% neq 0 (
    echo ❌ Échec de l'installation des dépendances
    pause
    exit /b 1
)
echo ✅ Dépendances installées avec succès
echo.

REM Déterminer l'action à effectuer
if "%1"=="dev" goto dev_build
if "%1"=="debug" goto debug_build
if "%1"=="build" goto production_build
if "%1"=="" goto production_build
goto show_usage

:dev_build
echo ℹ️  Lancement en mode développement...
tauri dev
goto end

:production_build
echo ℹ️  Build de production en cours...
echo ⏳ Cela peut prendre plusieurs minutes...
echo.
tauri build
if %errorlevel% neq 0 (
    echo ❌ Échec du build de production
    pause
    exit /b 1
)

echo.
echo ✅ Build de production terminé avec succès!
echo.
echo ℹ️  Fichiers générés dans:
echo   📁 src-tauri\target\release\bundle\msi\ (Installeur Windows)
echo   📁 src-tauri\target\release\bundle\nsis\ (Installeur NSIS)
echo   📁 src-tauri\target\release\bundle\ (Autres formats)
echo.
echo ℹ️  Testez l'exécutable avant distribution!
echo.

REM Ouvrir le dossier des builds
set "bundle_dir=%~dp0src-tauri\target\release\bundle"
if exist "%bundle_dir%" (
    echo 📂 Ouvrir le dossier des builds? (O/N)
    set /p open_folder=
    if /i "!open_folder!"=="O" (
        explorer "%bundle_dir%"
    )
)
goto end

:debug_build
echo ℹ️  Build de debug en cours (plus rapide)...
tauri build --debug
if %errorlevel% neq 0 (
    echo ❌ Échec du build de debug
    pause
    exit /b 1
)

echo.
echo ✅ Build de debug terminé avec succès!
echo.
echo ℹ️  Fichiers générés dans:
echo   📁 src-tauri\target\debug\bundle\
echo.
echo ⚠️  Attention: Version debug - performance réduite
goto end

:show_usage
echo Usage: %0 [dev^|build^|debug]
echo.
echo   dev    - Lance l'application en mode développement
echo   build  - Crée l'exécutable de production (défaut)
echo   debug  - Crée l'exécutable de debug (plus rapide)
echo.
pause
exit /b 1

:end
echo.
echo 🎉 Terminé!
pause