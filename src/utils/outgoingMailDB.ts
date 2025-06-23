// src/utils/outgoingMailDB.ts
import Dexie, { Table } from "dexie";
import { OutgoingMail } from "@/types/mail";

// 1. Définition de la base de données Dexie
export class OutgoingMailDB extends Dexie {
  outgoingMails!: Table<OutgoingMail, number>;

  constructor() {
    super("OutgoingMailDatabase");
    this.version(1).stores({
      outgoingMails: "++id, chronoNumber, subject, senderName, recipientService"
      // Ajoute ou adapte les indexes selon les champs de OutgoingMail si besoin
    });
  }
}

export const db = new OutgoingMailDB();

const LOCAL_STORAGE_KEY = "outgoingMails";

// 2. Migration LocalStorage vers IndexedDB (à appeler au démarrage)
export async function migrateLocalStorageToIndexedDB() {
  const alreadyMigrated = localStorage.getItem("outgoingMailsMigrated");
  if (alreadyMigrated) return;

  const existing = await db.outgoingMails.count();
  if (existing > 0) {
    localStorage.setItem("outgoingMailsMigrated", "true");
    return;
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return;
  const mails: OutgoingMail[] = JSON.parse(raw);

  if (Array.isArray(mails) && mails.length > 0) {
    // On enlève l'id pour laisser Dexie gérer l'auto-incrémentation
    const withoutId = mails.map(({ id, ...rest }) => rest as OutgoingMail);
    await db.outgoingMails.bulkAdd(withoutId);
  }
  localStorage.setItem("outgoingMailsMigrated", "true");
  // Optionnel : localStorage.removeItem(LOCAL_STORAGE_KEY);
}

// 3. Fonctions CRUD

export async function getAllOutgoingMails(): Promise<OutgoingMail[]> {
  return await db.outgoingMails.toArray();
}

export async function addOutgoingMail(mail: Omit<OutgoingMail, "id">): Promise<number> {
  return await db.outgoingMails.add(mail);
}

export async function updateOutgoingMail(id: number, update: Partial<OutgoingMail>) {
  return await db.outgoingMails.update(id, update);
}

export async function deleteOutgoingMail(id: number) {
  return await db.outgoingMails.delete(id);
}

export async function getOutgoingMailById(id: number): Promise<OutgoingMail | undefined> {
  return await db.outgoingMails.get(id);
}
