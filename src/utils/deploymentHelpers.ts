// Utilitaires pour le déploiement et la distribution

import { tauriBridge } from './tauriBridge';
import { configManager } from './configManager';

interface DeploymentInfo {
  platform: string;
  isTauri: boolean;
  storageMode: 'tauri' | 'fallback';
  appVersion: string;
}

class DeploymentHelpers {
  
  // Obtient les informations de déploiement
  async getDeploymentInfo(): Promise<DeploymentInfo> {
    try {
      return {
        platform: await tauriBridge.getPlatform(),
        isTauri: tauriBridge.isTauri(),
        storageMode: tauriBridge.getOptimalStorageMode(),
        appVersion: this.getAppVersion()
      };
    } catch (error) {
      console.error('Erreur récupération infos déploiement:', error);
      return {
        platform: 'unknown',
        isTauri: false,
        storageMode: 'fallback',
        appVersion: '1.0.0'
      };
    }
  }

  // Obtient la version de l'application
  getAppVersion(): string {
    // En production Electron, cette info viendra du package.json
    return process.env.VITE_APP_VERSION || '1.0.0';
  }

  // Vérifie la compatibilité système
  async checkSystemCompatibility(): Promise<{
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérifier Tauri
    if (!tauriBridge.isTauri()) {
      issues.push('Environnement Tauri non détecté');
      recommendations.push('Compiler avec Tauri pour accès complet au système de fichiers');
    }

    // Vérifier le stockage
    try {
      if (typeof Storage === "undefined") {
        issues.push('API Storage non disponible');
      }
    } catch {
      issues.push('Erreur accès stockage');
    }

    // Vérifier les permissions Tauri
    if (tauriBridge.isTauri()) {
      const versions = await tauriBridge.getVersions();
      if (!versions.tauri) {
        issues.push('Version Tauri non détectée');
      }
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Génère un rapport de diagnostic
  async generateDiagnosticReport(): Promise<string> {
    const deploymentInfo = await this.getDeploymentInfo();
    const compatibility = await this.checkSystemCompatibility();
    
    let report = '=== RAPPORT DIAGNOSTIC ANOR DESKTOP ===\n\n';
    
    // Informations générales
    report += `Version: ${deploymentInfo.appVersion}\n`;
    report += `Plateforme: ${deploymentInfo.platform}\n`;
    report += `Environnement: ${deploymentInfo.isTauri ? 'Tauri' : 'Navigateur'}\n`;
    report += `Mode stockage: ${deploymentInfo.storageMode}\n`;
    report += `Date: ${new Date().toISOString()}\n\n`;
    
    // Compatibilité
    report += '=== COMPATIBILITÉ SYSTÈME ===\n';
    report += `Compatible: ${compatibility.compatible ? 'OUI' : 'NON'}\n`;
    
    if (compatibility.issues.length > 0) {
      report += '\nProblèmes détectés:\n';
      compatibility.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
    }
    
    if (compatibility.recommendations.length > 0) {
      report += '\nRecommandations:\n';
      compatibility.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }
    
    // Informations techniques
    if (tauriBridge.isTauri()) {
      const versions = await tauriBridge.getVersions();
      report += '\n=== VERSIONS TAURI ===\n';
      report += `Tauri: ${versions.tauri}\n`;
      report += `Webview: ${versions.webview}\n`;
      report += `Platform: ${versions.platform}\n`;
    }
    
    // Configuration utilisateur
    try {
      const config = await configManager.loadConfig();
      report += '\n=== CONFIGURATION UTILISATEUR ===\n';
      report += `Service: ${config.serviceName}\n`;
      report += `Logo personnalisé: ${config.customLogo ? 'OUI' : 'NON'}\n`;
    } catch (error) {
      report += '\n=== ERREUR CONFIGURATION ===\n';
      report += `Impossible de charger la configuration: ${error}\n`;
    }
    
    report += '\n=== FIN DU RAPPORT ===';
    
    return report;
  }

  // Exporte le rapport de diagnostic
  async exportDiagnosticReport(): Promise<void> {
    try {
      const report = await this.generateDiagnosticReport();
      const filename = `diagnostic-anor-${new Date().toISOString().split('T')[0]}.txt`;
      
      if (tauriBridge.isTauri()) {
        // Utiliser l'API Tauri pour sauvegarder
        const success = await tauriBridge.writeFile(filename, report);
        if (success) {
          console.log('Rapport exporté avec succès');
        }
      } else {
        // Fallback: téléchargement direct
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur export rapport diagnostic:', error);
      throw error;
    }
  }

  // Prépare l'application pour la production
  async prepareForProduction(): Promise<{
    ready: boolean;
    checklist: { item: string; status: 'ok' | 'warning' | 'error'; message?: string }[];
  }> {
    const checklist: { item: string; status: 'ok' | 'warning' | 'error'; message?: string }[] = [];
    
    // Vérifier la configuration
    try {
      const config = await configManager.loadConfig();
      checklist.push({ item: 'Configuration', status: 'ok' });
    } catch {
      checklist.push({ 
        item: 'Configuration', 
        status: 'error', 
        message: 'Configuration non accessible' 
      });
    }
    
    // Vérifier le stockage
    if (tauriBridge.getOptimalStorageMode() === 'fallback') {
      checklist.push({ 
        item: 'Stockage', 
        status: 'warning', 
        message: 'Mode de stockage limité' 
      });
    } else {
      checklist.push({ item: 'Stockage', status: 'ok' });
    }
    
    // Vérifier la compatibilité
    const compatibility = await this.checkSystemCompatibility();
    if (compatibility.compatible) {
      checklist.push({ item: 'Compatibilité', status: 'ok' });
    } else {
      checklist.push({ 
        item: 'Compatibilité', 
        status: 'error', 
        message: compatibility.issues.join(', ') 
      });
    }
    
    const hasErrors = checklist.some(item => item.status === 'error');
    
    return {
      ready: !hasErrors,
      checklist
    };
  }
}

export const deploymentHelpers = new DeploymentHelpers();