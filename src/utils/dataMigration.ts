import { getAllIncomingMails as getIndexedDBIncomingMails } from "./incomingMailStorage";
import { getAllOutgoingMails as getIndexedDBOutgoingMails } from "./outgoingMailStorage";
import { 
  saveIncomingMail as saveFileSystemIncomingMail,
  saveOutgoingMail as saveFileSystemOutgoingMail,
  createNewMailFile,
  getCurrentFileInfo
} from "./fileSystemStorage";
import { IncomingMail, OutgoingMail } from "@/types/mail";

export interface MigrationResult {
  success: boolean;
  incomingCount: number;
  outgoingCount: number;
  errors: string[];
}

// Check if there's existing data in IndexedDB
export const hasIndexedDBData = async (): Promise<boolean> => {
  try {
    const incomingMails = await getIndexedDBIncomingMails();
    const outgoingMails = await getIndexedDBOutgoingMails();
    return incomingMails.length > 0 || outgoingMails.length > 0;
  } catch (error) {
    console.error('Error checking IndexedDB data:', error);
    return false;
  }
};

// Migrate data from IndexedDB to File System
export const migrateFromIndexedDB = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    incomingCount: 0,
    outgoingCount: 0,
    errors: []
  };

  try {
    // Check if we already have a file system file open
    const fileInfo = getCurrentFileInfo();
    if (!fileInfo.hasFile) {
      // Create a new file for the migration
      const fileCreated = await createNewMailFile();
      if (!fileCreated) {
        result.errors.push('Could not create new file for migration');
        return result;
      }
    }

    // Get all data from IndexedDB
    const incomingMails = await getIndexedDBIncomingMails();
    const outgoingMails = await getIndexedDBOutgoingMails();

    // Migrate incoming mails
    for (const mail of incomingMails) {
      try {
        const { id, ...mailWithoutId } = mail;
        await saveFileSystemIncomingMail(mailWithoutId);
        result.incomingCount++;
      } catch (error) {
        result.errors.push(`Error migrating incoming mail ${mail.id}: ${error}`);
      }
    }

    // Migrate outgoing mails
    for (const mail of outgoingMails) {
      try {
        const { id, ...mailWithoutId } = mail;
        await saveFileSystemOutgoingMail(mailWithoutId);
        result.outgoingCount++;
      } catch (error) {
        result.errors.push(`Error migrating outgoing mail ${mail.id}: ${error}`);
      }
    }

    result.success = result.errors.length === 0;
    return result;

  } catch (error) {
    result.errors.push(`Migration failed: ${error}`);
    return result;
  }
};

// Get migration status
export const getMigrationStatus = async (): Promise<{
  hasIndexedDBData: boolean;
  hasFileSystemFile: boolean;
  needsMigration: boolean;
}> => {
  const hasIndexedData = await hasIndexedDBData();
  const fileInfo = getCurrentFileInfo();
  
  return {
    hasIndexedDBData: hasIndexedData,
    hasFileSystemFile: fileInfo.hasFile,
    needsMigration: hasIndexedData && !fileInfo.hasFile
  };
};