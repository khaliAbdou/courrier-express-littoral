
import { OutgoingMail } from "@/types/mail";

export function saveOutgoingMailToLocalStorage(mail: any) {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push(mail);
  localStorage.setItem(key, JSON.stringify(mails));
}

export function updateOutgoingMailInLocalStorage(mailId: string, updatedMail: any) {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return false;
  
  const mails = JSON.parse(existing);
  const mailIndex = mails.findIndex((mail: any) => mail.id === mailId);
  
  if (mailIndex === -1) return false;
  
  mails[mailIndex] = { ...mails[mailIndex], ...updatedMail };
  localStorage.setItem(key, JSON.stringify(mails));
  return true;
}

export function getAllOutgoingMails(): OutgoingMail[] {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
    issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
  }));
}
