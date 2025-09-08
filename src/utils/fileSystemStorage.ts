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
        description: 'Mail data files',
        accept: { 'application/json': ['.json'] }
      }]
    });

    currentFileHandle = fileHandle;
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
        description: 'Mail data files',
        accept: { 'application/json': ['.json'] }
      }],
      suggestedName: `mail-data-${new Date().toISOString().split('T')[0]}.json`
    });

    currentFileHandle = fileHandle;
    mailData = {
      incomingMails: [],
      outgoingMails: [],
      version: '1.0',
      exportDate: new Date().toISOString()
    };

    return await saveToFile();
  } catch (error) {
    console.error('Error creating file:', error);
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
export const getCurrentFileInfo = (): { hasFile: boolean; fileName?: string } => {
  return {
    hasFile: currentFileHandle !== null,
    fileName: currentFileHandle?.name
  };
};