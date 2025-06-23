
import { OutgoingMail } from "@/types/mail";
import { db } from "./database";

export async function saveOutgoingMailToLocalStorage(mail: any) {
  try {
    await db.outgoingMails.add(mail);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du courrier sortant:", error);
    throw error;
  }
}

export async function updateOutgoingMailInLocalStorage(mailId: string, updatedMail: any) {
  try {
    const result = await db.outgoingMails.update(mailId, updatedMail);
    return result > 0;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier sortant:", error);
    return false;
  }
}

export async function getAllOutgoingMails(): Promise<OutgoingMail[]> {
  try {
    const mails = await db.outgoingMails.toArray();
    return mails.map((mail: any) => ({
      ...mail,
      date: mail.date ? new Date(mail.date) : undefined,
      issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers sortants:", error);
    return [];
  }
}

export async function deleteOutgoingMail(mailId: string): Promise<boolean> {
  try {
    await db.outgoingMails.delete(mailId);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier sortant:", error);
    return false;
  }
}
