
import { IncomingMail } from "@/types/mail";

export function saveIncomingMailToLocalStorage(mail: any) {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push({ ...mail, status: "Processing" });
  localStorage.setItem(key, JSON.stringify(mails));
}

export function updateIncomingMailInLocalStorage(mailId: string, updatedMail: any) {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return false;
  
  const mails = JSON.parse(existing);
  const mailIndex = mails.findIndex((mail: any) => mail.id === mailId);
  
  if (mailIndex === -1) return false;
  
  mails[mailIndex] = { ...mails[mailIndex], ...updatedMail };
  localStorage.setItem(key, JSON.stringify(mails));
  return true;
}

export function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  try {
    return JSON.parse(existing).map((mail: any) => ({
      ...mail,
      date: mail.date ? new Date(mail.date) : undefined,
      issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
    }));
  } catch {
    return [];
  }
}
