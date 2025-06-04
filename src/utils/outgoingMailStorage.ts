
export function saveOutgoingMailToLocalStorage(mail: any) {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push(mail);
  localStorage.setItem(key, JSON.stringify(mails));
}
