
import Dexie, { Table } from "dexie";
import { IncomingMail } from "@/types/mail";

export class IncomingMailDB extends Dexie {
  incomingMails!: Table<IncomingMail, number>;

  constructor() {
    super("IncomingMailDatabase");
    this.version(1).stores({
      incomingMails: "++id, chronoNumber, subject, senderName, recipientService, mailType, date"
    });
  }
}

export const incomingDB = new IncomingMailDB();

const LOCAL_STORAGE_KEY = "incomingMails";

export async function migrateIncomingMailsToIndexedDB() {
  try {
    const alreadyMigrated = localStorage.getItem("incomingMailsMigrated");
    if (alreadyMigrated) return;

    const existing = await incomingDB.incomingMails.count();
    if (existing > 0) {
      localStorage.setItem("incomingMailsMigrated", "true");
      return;
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem("incomingMailsMigrated", "true");
      return;
    }
    
    const mails: IncomingMail[] = JSON.parse(raw);

    if (Array.isArray(mails) && mails.length > 0) {
      const withoutId = mails.map(({ id, ...rest }) => ({
        ...rest,
        status: rest.status || "Pending"
      }) as Omit<IncomingMail, "id">);
      await incomingDB.incomingMails.bulkAdd(withoutId);
    }
    localStorage.setItem("incomingMailsMigrated", "true");
  } catch (error) {
    console.error("Erreur lors de la migration des courriers entrants:", error);
  }
}

export async function getAllIncomingMails(): Promise<IncomingMail[]> {
  try {
    return await incomingDB.incomingMails.toArray();
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers entrants:", error);
    return [];
  }
}

export async function addIncomingMail(mail: Omit<IncomingMail, "id">): Promise<number> {
  try {
    return await incomingDB.incomingMails.add({
      ...mail,
      status: mail.status || "Pending"
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du courrier entrant:", error);
    throw error;
  }
}

export async function updateIncomingMail(id: number, update: Partial<IncomingMail>) {
  try {
    return await incomingDB.incomingMails.update(id, update);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier entrant:", error);
    throw error;
  }
}

export async function deleteIncomingMail(id: number) {
  try {
    return await incomingDB.incomingMails.delete(id);
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier entrant:", error);
    throw error;
  }
}

export async function getIncomingMailById(id: number): Promise<IncomingMail | undefined> {
  try {
    return await incomingDB.incomingMails.get(id);
  } catch (error) {
    console.error("Erreur lors de la récupération du courrier entrant:", error);
    return undefined;
  }
}
