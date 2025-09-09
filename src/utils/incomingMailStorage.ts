
import { IncomingMail } from "@/types/mail";
import { storageAdapter } from "./storageAdapter";

export async function saveIncomingMailToLocalStorage(mail: any) {
  try {
    await storageAdapter.saveIncomingMail(mail);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du courrier entrant:", error);
    throw error;
  }
}

export async function updateIncomingMailInLocalStorage(mailId: string, updatedMail: any) {
  try {
    return await storageAdapter.updateIncomingMail(mailId, updatedMail);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier entrant:", error);
    return false;
  }
}

export async function getAllIncomingMails(): Promise<IncomingMail[]> {
  try {
    return await storageAdapter.getAllIncomingMails();
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers entrants:", error);
    return [];
  }
}

export async function deleteIncomingMail(mailId: string): Promise<boolean> {
  try {
    return await storageAdapter.deleteIncomingMail(mailId);
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier entrant:", error);
    return false;
  }
}
