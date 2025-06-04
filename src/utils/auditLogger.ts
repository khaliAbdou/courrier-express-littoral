
import { toast } from 'sonner';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  entityType: 'incoming_mail' | 'outgoing_mail' | 'document' | 'system';
  entityId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private static readonly STORAGE_KEY = 'audit_log';

  static log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
    try {
      const auditEntry: AuditEntry = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent
      };

      const existingLogs = this.getLogs();
      existingLogs.push(auditEntry);

      // Garder seulement les 1000 dernières entrées pour éviter que le localStorage devienne trop lourd
      const recentLogs = existingLogs.slice(-1000);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs));
      
      console.log('Audit log:', auditEntry);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log d\'audit:', error);
    }
  }

  static getLogs(): AuditEntry[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      if (!logs) return [];
      
      return JSON.parse(logs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
    } catch (error) {
      console.error('Erreur lors de la lecture des logs d\'audit:', error);
      return [];
    }
  }

  static getLogsByEntity(entityType: string, entityId: string): AuditEntry[] {
    return this.getLogs().filter(log => 
      log.entityType === entityType && log.entityId === entityId
    );
  }

  static clearLogs(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    toast.success('Logs d\'audit supprimés');
  }

  private static getClientIP(): string {
    // En mode développement/localStorage, on ne peut pas obtenir la vraie IP
    return 'localhost';
  }

  // Méthodes helper pour les actions courantes
  static logMailView(mailType: 'incoming' | 'outgoing', mailId: string, chronoNumber: string): void {
    this.log({
      userId: 'current_user', // À remplacer par le système d'auth
      action: 'VIEW',
      entityType: mailType === 'incoming' ? 'incoming_mail' : 'outgoing_mail',
      entityId: mailId,
      details: `Consultation du courrier ${chronoNumber}`
    });
  }

  static logMailEdit(mailType: 'incoming' | 'outgoing', mailId: string, chronoNumber: string, changes: string): void {
    this.log({
      userId: 'current_user',
      action: 'EDIT',
      entityType: mailType === 'incoming' ? 'incoming_mail' : 'outgoing_mail',
      entityId: mailId,
      details: `Modification du courrier ${chronoNumber}: ${changes}`
    });
  }

  static logMailCreate(mailType: 'incoming' | 'outgoing', mailId: string, chronoNumber: string): void {
    this.log({
      userId: 'current_user',
      action: 'CREATE',
      entityType: mailType === 'incoming' ? 'incoming_mail' : 'outgoing_mail',
      entityId: mailId,
      details: `Création du courrier ${chronoNumber}`
    });
  }

  static logExport(exportType: 'csv' | 'excel' | 'pdf', dataCount: number): void {
    this.log({
      userId: 'current_user',
      action: 'EXPORT',
      entityType: 'system',
      entityId: 'statistics',
      details: `Export ${exportType.toUpperCase()} de ${dataCount} enregistrements`
    });
  }
}
