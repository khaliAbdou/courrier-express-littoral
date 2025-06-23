// src/utils/incomingMailDB.ts
import { IncomingMail } from "@/types/mail";

// ... openDB, getAllIncomingMails, addIncomingMail etc.

export async function migrateLocalStorageToIndexedDB() {
  // Vérifie si IndexedDB est déjà peuplé
  const db = await openDB();
  const existing = await getAllIncomingMails();
  if (existing.length > 0) return; // Déjà migré

  // Récupère les données du localStorage
  const raw = localStorage.getItem("incomingMails");
  if (!raw) return;
  const mails: IncomingMail[] = JSON.parse(raw);

  // Ajoute-les dans IndexedDB
  await Promise.all(mails.map(async (mail) => {
    // Enlève l'id s'il existe, il sera auto-incrémenté
    const { id, ...rest } = mail as any;
    await addIncomingMail(rest);
  }));
  // Optionnel : tu peux vider le localStorage
  // localStorage.removeItem("incomingMails");
}
