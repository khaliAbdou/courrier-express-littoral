import { IncomingMail, OutgoingMail } from "@/types/mail";
import { CustomFileSystemFileHandle } from "@/types/fileSystemAccess";

// Check if File System Access API is supported
export const isFileSystemAccessSupported = (): boolean => {
  return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
};

interface MailData {
  incomingMails: IncomingMail[];
  outgoingMails: OutgoingMail[];
  version: string;
  exportDate: string;
}

let currentFileHandle: CustomFileSystemFileHandle | null = null;
let mailData: MailData = {
  incomingMails: [],
  outgoingMails: [],
  version: '1.0',
  exportDate: new Date().toISOString()
};

// Initialize or load data
export const initializeFileSystem = async (): Promise<void> => {
  const savedFileHandle = localStorage.getItem('mailFileHandle');
  if (savedFileHandle && isFileSystemAccessSupported()) {
    try {
      // Try to restore the file handle (this might not work in all browsers)
      const result = await window.showOpenFilePicker({
        types: [{
          description: 'Mail data files',
          accept: { 'application/json': ['.json'] }
        }]
      });
      currentFileHandle = result[0];
      await loadFromFile();
    } catch (error) {
      console.log('No file selected or error restoring file handle');
    }
  }
};

// Open existing file
export const openMailFile = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported');
  }

  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Fichiers de données courrier (*.json)',
        accept: { 'application/json': ['.json'] }
      }],
      multiple: false
    });

    currentFileHandle = fileHandle;
    
    // Save file handle reference for persistence
    try {
      localStorage.setItem('mailFileHandleName', fileHandle.name);
    } catch (e) {
      console.warn('Could not save file handle name to localStorage');
    }

    return await loadFromFile();
  } catch (error) {
    console.error('Error opening file:', error);
    return false;
  }
};

// Create new file
export const createNewMailFile = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported');
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      types: [{
        description: 'Fichiers de données courrier (*.json)',
        accept: { 'application/json': ['.json'] }
      }],
      suggestedName: `courrier-anor-${new Date().toISOString().split('T')[0]}.json`
    });

    currentFileHandle = fileHandle;
    mailData = {
      incomingMails: [],
      outgoingMails: [],
      version: '1.0',
      exportDate: new Date().toISOString()
    };

    // Save file handle reference for persistence
    try {
      localStorage.setItem('mailFileHandleName', fileHandle.name);
    } catch (e) {
      console.warn('Could not save file handle name to localStorage');
    }

    return await saveToFile();
  } catch (error) {
    console.error('Error creating file:', error);
    return false;
  }
};

// Save file to a specific location (Save As functionality)
export const saveMailFileAs = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported');
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      types: [{
        description: 'Fichiers de données courrier (*.json)',
        accept: { 'application/json': ['.json'] }
      }],
      suggestedName: currentFileHandle?.name || `courrier-anor-${new Date().toISOString().split('T')[0]}.json`
    });

    currentFileHandle = fileHandle;
    
    // Save file handle reference for persistence
    try {
      localStorage.setItem('mailFileHandleName', fileHandle.name);
    } catch (e) {
      console.warn('Could not save file handle name to localStorage');
    }

    return await saveToFile();
  } catch (error) {
    console.error('Error saving file as:', error);
    return false;
  }
};

// Load data from current file
const loadFromFile = async (): Promise<boolean> => {
  if (!currentFileHandle) return false;

  try {
    const file = await currentFileHandle.getFile();
    const content = await file.text();
    const data = JSON.parse(content) as MailData;
    
    // Convert date strings back to Date objects
    mailData = {
      ...data,
      incomingMails: data.incomingMails.map(mail => ({
        ...mail,
        date: new Date(mail.date),
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
        responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
      })),
      outgoingMails: data.outgoingMails.map(mail => ({
        ...mail,
        date: new Date(mail.date),
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      }))
    };

    return true;
  } catch (error) {
    console.error('Error loading from file:', error);
    return false;
  }
};

// Save data to current file
const saveToFile = async (): Promise<boolean> => {
  if (!currentFileHandle) return false;

  try {
    const writable = await currentFileHandle.createWritable();
    const dataToSave = {
      ...mailData,
      exportDate: new Date().toISOString()
    };
    
    await writable.write(JSON.stringify(dataToSave, null, 2));
    await writable.close();
    return true;
  } catch (error) {
    console.error('Error saving to file:', error);
    return false;
  }
};

// Incoming Mail Operations
export const saveIncomingMail = async (mail: Omit<IncomingMail, 'id'>): Promise<string> => {
  const newMail: IncomingMail = {
    ...mail,
    id: crypto.randomUUID(),
    status: mail.status || "Processing"
  };

  mailData.incomingMails.push(newMail);
  await saveToFile();
  return newMail.id;
};

export const updateIncomingMail = async (mailId: string, updatedMail: Partial<IncomingMail>): Promise<boolean> => {
  const index = mailData.incomingMails.findIndex(mail => mail.id === mailId);
  if (index === -1) return false;

  mailData.incomingMails[index] = { ...mailData.incomingMails[index], ...updatedMail };
  return await saveToFile();
};

export const deleteIncomingMail = async (mailId: string): Promise<boolean> => {
  const index = mailData.incomingMails.findIndex(mail => mail.id === mailId);
  if (index === -1) return false;

  mailData.incomingMails.splice(index, 1);
  return await saveToFile();
};

export const getAllIncomingMails = (): IncomingMail[] => {
  return [...mailData.incomingMails];
};

// Outgoing Mail Operations
export const saveOutgoingMail = async (mail: Omit<OutgoingMail, 'id'>): Promise<string> => {
  const newMail: OutgoingMail = {
    ...mail,
    id: crypto.randomUUID(),
  };

  mailData.outgoingMails.push(newMail);
  await saveToFile();
  return newMail.id;
};

export const updateOutgoingMail = async (mailId: string, updatedMail: Partial<OutgoingMail>): Promise<boolean> => {
  const index = mailData.outgoingMails.findIndex(mail => mail.id === mailId);
  if (index === -1) return false;

  mailData.outgoingMails[index] = { ...mailData.outgoingMails[index], ...updatedMail };
  return await saveToFile();
};

export const deleteOutgoingMail = async (mailId: string): Promise<boolean> => {
  const index = mailData.outgoingMails.findIndex(mail => mail.id === mailId);
  if (index === -1) return false;

  mailData.outgoingMails.splice(index, 1);
  return await saveToFile();
};

export const getAllOutgoingMails = (): OutgoingMail[] => {
  return [...mailData.outgoingMails];
};

// Get current file info
export const getCurrentFileInfo = (): { hasFile: boolean; fileName?: string; filePath?: string } => {
  return {
    hasFile: currentFileHandle !== null,
    fileName: currentFileHandle?.name,
    filePath: currentFileHandle?.name // In File System Access API, we don't get full path for security reasons
  };
};

// Export current data to a new location
export const exportMailData = async (): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported');
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      types: [{
        description: 'Fichiers de données courrier (*.json)',
        accept: { 'application/json': ['.json'] }
      }],
      suggestedName: `export-courrier-${new Date().toISOString().split('T')[0]}.json`
    });

    const writable = await fileHandle.createWritable();
    const dataToExport = {
      ...mailData,
      exportDate: new Date().toISOString()
    };
    
    await writable.write(JSON.stringify(dataToExport, null, 2));
    await writable.close();
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

// Import data from a file (merge with current data)
export const importMailData = async (): Promise<{ success: boolean; importedCount: number; errors: string[] }> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API not supported');
  }

  const result = {
    success: false,
    importedCount: 0,
    errors: [] as string[]
  };

  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Fichiers de données courrier (*.json)',
        accept: { 'application/json': ['.json'] }
      }]
    });

    const file = await fileHandle.getFile();
    const content = await file.text();
    const importedData = JSON.parse(content) as MailData;
    
    // Merge imported data with current data
    if (importedData.incomingMails) {
      for (const mail of importedData.incomingMails) {
        try {
          const { id, ...mailWithoutId } = mail;
          await saveIncomingMail(mailWithoutId);
          result.importedCount++;
        } catch (error) {
          result.errors.push(`Erreur importation courrier entrant: ${error}`);
        }
      }
    }

    if (importedData.outgoingMails) {
      for (const mail of importedData.outgoingMails) {
        try {
          const { id, ...mailWithoutId } = mail;
          await saveOutgoingMail(mailWithoutId);
          result.importedCount++;
        } catch (error) {
          result.errors.push(`Erreur importation courrier sortant: ${error}`);
        }
      }
    }

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    result.errors.push(`Erreur lors de l'importation: ${error}`);
    return result;
  }
};