
import Dexie, { Table } from "dexie";
import { OutgoingMail } from "@/types/mail";

// 1. Définition de la base de données Dexie
export class OutgoingMailDB extends Dexie {
  outgoingMails!: Table<OutgoingMail, number>;

  constructor() {
    super("OutgoingMailDatabase");
    this.version(1).stores({
      outgoingMails: "++id, chronoNumber, subject, correspondent, service, date"
    });
  }
}

export const db = new OutgoingMailDB();

const LOCAL_STORAGE_KEY = "outgoingMails";

// 2. Migration LocalStorage vers IndexedDB (à appeler au démarrage)
export async function migrateLocalStorageToIndexedDB() {
  try {
    const alreadyMigrated = localStorage.getItem("outgoingMailsMigrated");
    if (alreadyMigrated) return;

    const existing = await db.outgoingMails.count();
    if (existing > 0) {
      localStorage.setItem("outgoingMailsMigrated", "true");
      return;
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem("outgoingMailsMigrated", "true");
      return;
    }
    
    const mails: OutgoingMail[] = JSON.parse(raw);

    if (Array.isArray(mails) && mails.length > 0) {
      // On enlève l'id pour laisser Dexie gérer l'auto-incrémentation
      const withoutId = mails.map(({ id, ...rest }) => ({
        ...rest,
        status: rest.status || "Processing"
      }) as Omit<OutgoingMail, "id">);
      await db.outgoingMails.bulkAdd(withoutId);
    }
    localStorage.setItem("outgoingMailsMigrated", "true");
  } catch (error) {
    console.error("Erreur lors de la migration:", error);
  }
}

// 3. Fonctions CRUD

export async function getAllOutgoingMails(): Promise<OutgoingMail[]> {
  try {
    return await db.outgoingMails.toArray();
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers:", error);
    return [];
  }
}

export async function addOutgoingMail(mail: Omit<OutgoingMail, "id">): Promise<number> {
  try {
    return await db.outgoingMails.add({
      ...mail,
      status: mail.status || "Processing"
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du courrier:", error);
    throw error;
  }
}

export async function updateOutgoingMail(id: number, update: Partial<OutgoingMail>) {
  try {
    return await db.outgoingMails.update(id, update);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier:", error);
    throw error;
  }
}

export async function deleteOutgoingMail(id: number) {
  try {
    return await db.outgoingMails.delete(id);
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier:", error);
    throw error;
  }
}

export async function getOutgoingMailById(id: number): Promise<OutgoingMail | undefined> {
  try {
    return await db.outgoingMails.get(id);
  } catch (error) {
    console.error("Erreur lors de la récupération du courrier:", error);
    return undefined;
  }
}
