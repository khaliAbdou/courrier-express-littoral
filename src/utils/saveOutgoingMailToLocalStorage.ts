
import { OutgoingMail } from "@/types/mail";
import { addOutgoingMail } from "./outgoingMailDB";

// Fonction de compatibilité pour l'ancien code
export const saveOutgoingMailToLocalStorage = async (mail: OutgoingMail) => {
  try {
    const { id, ...mailData } = mail;
    await addOutgoingMail(mailData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    throw error;
  }
};
