#!/bin/bash

# Script de build automatisé pour ANOR Desktop (Tauri)
# Usage: ./build-tauri.sh [dev|build|debug]

set -e

echo "🚀 ANOR Desktop - Build Tauri"
echo "================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js non trouvé. Installez Node.js depuis https://nodejs.org/"
        exit 1
    fi
    log_success "Node.js trouvé: $(node --version)"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm non trouvé."
        exit 1
    fi
    log_success "npm trouvé: $(npm --version)"
    
    # Vérifier Rust
    if ! command -v rustc &> /dev/null; then
        log_error "Rust non trouvé. Installez Rust depuis https://rustup.rs/"
        exit 1
    fi
    log_success "Rust trouvé: $(rustc --version)"
    
    # Vérifier Cargo
    if ! command -v cargo &> /dev/null; then
        log_error "Cargo non trouvé."
        exit 1
    fi
    log_success "Cargo trouvé: $(cargo --version)"
    
    # Vérifier si Tauri CLI est installé
    if ! command -v tauri &> /dev/null; then
        log_warning "Tauri CLI non trouvé. Installation..."
        npm install -g @tauri-apps/cli@latest
        if [ $? -eq 0 ]; then
            log_success "Tauri CLI installé avec succès"
        else
            log_error "Échec de l'installation de Tauri CLI"
            exit 1
        fi
    else
        log_success "Tauri CLI trouvé: $(tauri --version)"
    fi
}

# Installer les dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    npm install
    if [ $? -eq 0 ]; then
        log_success "Dépendances installées avec succès"
    else
        log_error "Échec de l'installation des dépendances"
        exit 1
    fi
}

# Build de développement
dev_build() {
    log_info "Lancement en mode développement..."
    tauri dev
}

# Build de production
production_build() {
    log_info "Build de production en cours..."
    tauri build
    
    if [ $? -eq 0 ]; then
        log_success "Build de production terminé avec succès!"
        echo ""
        log_info "Fichiers générés dans:"
        echo "  📁 src-tauri/target/release/bundle/msi/ (Installeur Windows)"
        echo "  📁 src-tauri/target/release/bundle/nsis/ (Installeur NSIS)"
        echo "  📁 src-tauri/target/release/bundle/ (Autres formats)"
        echo ""
        log_info "Testez l'exécutable avant distribution!"
    else
        log_error "Échec du build de production"
        exit 1
    fi
}

# Build de debug
debug_build() {
    log_info "Build de debug en cours (plus rapide)..."
    tauri build --debug
    
    if [ $? -eq 0 ]; then
        log_success "Build de debug terminé avec succès!"
        echo ""
        log_info "Fichiers générés dans:"
        echo "  📁 src-tauri/target/debug/bundle/"
        echo ""
        log_warning "Attention: Version debug - performance réduite"
    else
        log_error "Échec du build de debug"
        exit 1
    fi
}

# Menu principal
main() {
    check_prerequisites
    install_dependencies
    
    case "${1:-build}" in
        "dev")
            dev_build
            ;;
        "build")
            production_build
            ;;
        "debug")
            debug_build
            ;;
        *)
            echo "Usage: $0 [dev|build|debug]"
            echo ""
            echo "  dev    - Lance l'application en mode développement"
            echo "  build  - Crée l'exécutable de production (défaut)"
            echo "  debug  - Crée l'exécutable de debug (plus rapide)"
            exit 1
            ;;
    esac
}

# Exécuter le script principal
main "$@"