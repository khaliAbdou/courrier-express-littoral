import { IncomingMail, OutgoingMail } from "@/types/mail";
import { 
  isFileSystemAccessSupported,
  getCurrentFileInfo,
  saveIncomingMail as saveFileSystemIncomingMail,
  updateIncomingMail as updateFileSystemIncomingMail,
  deleteIncomingMail as deleteFileSystemIncomingMail,
  getAllIncomingMails as getFileSystemIncomingMails,
  saveOutgoingMail as saveFileSystemOutgoingMail,
  updateOutgoingMail as updateFileSystemOutgoingMail,
  deleteOutgoingMail as deleteFileSystemOutgoingMail,
  getAllOutgoingMails as getFileSystemOutgoingMails
} from "./fileSystemStorage";
import {
  saveIncomingMailToLocalStorage,
  updateIncomingMailInLocalStorage,
  deleteIncomingMail as deleteIndexedDBIncomingMail,
  getAllIncomingMails as getIndexedDBIncomingMails
} from "./incomingMailStorage";
import {
  saveOutgoingMailToLocalStorage,
  updateOutgoingMailInLocalStorage,
  deleteOutgoingMail as deleteIndexedDBOutgoingMail,
  getAllOutgoingMails as getIndexedDBOutgoingMails
} from "./outgoingMailStorage";

// Determine which storage system to use
const useFileSystem = (): boolean => {
  return isFileSystemAccessSupported() && getCurrentFileInfo().hasFile;
};

// Incoming Mail Adapter Functions
export const saveIncomingMail = async (mail: any): Promise<void> => {
  if (useFileSystem()) {
    await saveFileSystemIncomingMail(mail);
  } else {
    await saveIncomingMailToLocalStorage(mail);
  }
};

export const updateIncomingMail = async (mailId: string, updatedMail: any): Promise<boolean> => {
  if (useFileSystem()) {
    return await updateFileSystemIncomingMail(mailId, updatedMail);
  } else {
    return await updateIncomingMailInLocalStorage(mailId, updatedMail);
  }
};

export const deleteIncomingMail = async (mailId: string): Promise<boolean> => {
  if (useFileSystem()) {
    return await deleteFileSystemIncomingMail(mailId);
  } else {
    return await deleteIndexedDBIncomingMail(mailId);
  }
};

export const getAllIncomingMails = async (): Promise<IncomingMail[]> => {
  if (useFileSystem()) {
    return getFileSystemIncomingMails();
  } else {
    return await getIndexedDBIncomingMails();
  }
};

// Outgoing Mail Adapter Functions
export const saveOutgoingMail = async (mail: any): Promise<void> => {
  if (useFileSystem()) {
    await saveFileSystemOutgoingMail(mail);
  } else {
    await saveOutgoingMailToLocalStorage(mail);
  }
};

export const updateOutgoingMail = async (mailId: string, updatedMail: any): Promise<boolean> => {
  if (useFileSystem()) {
    return await updateFileSystemOutgoingMail(mailId, updatedMail);
  } else {
    return await updateOutgoingMailInLocalStorage(mailId, updatedMail);
  }
};

export const deleteOutgoingMail = async (mailId: string): Promise<boolean> => {
  if (useFileSystem()) {
    return await deleteFileSystemOutgoingMail(mailId);
  } else {
    return await deleteIndexedDBOutgoingMail(mailId);
  }
};

export const getAllOutgoingMails = async (): Promise<OutgoingMail[]> => {
  if (useFileSystem()) {
    return getFileSystemOutgoingMails();
  } else {
    return await getIndexedDBOutgoingMails();
  }
};

// Get current storage type info
export const getStorageInfo = () => {
  const fileInfo = getCurrentFileInfo();
  return {
    type: useFileSystem() ? 'filesystem' : 'indexeddb',
    isFileSystemSupported: isFileSystemAccessSupported(),
    hasFile: fileInfo.hasFile,
    fileName: fileInfo.fileName
  };
};