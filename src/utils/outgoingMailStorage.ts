
import { OutgoingMail } from "@/types/mail";
import { storageAdapter } from "./storageAdapter";

export async function saveOutgoingMailToLocalStorage(mail: any) {
  try {
    await storageAdapter.saveOutgoingMail(mail);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du courrier sortant:", error);
    throw error;
  }
}

export async function updateOutgoingMailInLocalStorage(mailId: string, updatedMail: any) {
  try {
    return await storageAdapter.updateOutgoingMail(mailId, updatedMail);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier sortant:", error);
    return false;
  }
}

export async function getAllOutgoingMails(): Promise<OutgoingMail[]> {
  try {
    return await storageAdapter.getAllOutgoingMails();
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers sortants:", error);
    return [];
  }
}

export async function deleteOutgoingMail(mailId: string): Promise<boolean> {
  try {
    return await storageAdapter.deleteOutgoingMail(mailId);
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier sortant:", error);
    return false;
  }
}
