
import { IncomingMail } from "@/types/mail";
import { db } from "./database";

export async function saveIncomingMailToLocalStorage(mail: any) {
  try {
    const mailWithStatus = { ...mail, status: "Processing" };
    await db.incomingMails.add(mailWithStatus);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du courrier entrant:", error);
    throw error;
  }
}

export async function updateIncomingMailInLocalStorage(mailId: string, updatedMail: any) {
  try {
    const result = await db.incomingMails.update(mailId, updatedMail);
    return result > 0;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier entrant:", error);
    return false;
  }
}

export async function getAllIncomingMails(): Promise<IncomingMail[]> {
  try {
    const mails = await db.incomingMails.toArray();
    return mails.map((mail: any) => ({
      ...mail,
      date: mail.date ? new Date(mail.date) : undefined,
      issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers entrants:", error);
    return [];
  }
}

export async function deleteIncomingMail(mailId: string): Promise<boolean> {
  try {
    await db.incomingMails.delete(mailId);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du courrier entrant:", error);
    return false;
  }
}
