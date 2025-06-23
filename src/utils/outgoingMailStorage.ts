import { OutgoingMail } from "@/types/mail";

const DB_NAME = "CourrierExpressDB";
const STORE_NAME = "outgoingMails";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export async function getAllOutgoingMails(): Promise<OutgoingMail[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addOutgoingMail(mail: Omit<OutgoingMail, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(mail);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

// Migration du localStorage vers IndexedDB
export async function migrateLocalStorageToIndexedDB() {
  const db = await openDB();
  const existing = await getAllOutgoingMails();
  if (existing.length > 0) return; // Déjà migré

  const raw = localStorage.getItem("outgoingMails");
  if (!raw) return;
  const mails: OutgoingMail[] = JSON.parse(raw);

  await Promise.all(mails.map(async (mail) => {
    const { id, ...rest } = mail as any;
    await addOutgoingMail(rest);
  }));
  // Optionnel : localStorage.removeItem("outgoingMails");
}
