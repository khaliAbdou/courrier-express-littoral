
import { IncomingMail } from "@/types/mail";
import { addIncomingMail, getAllIncomingMails, updateIncomingMail } from "./incomingMailDB";

// Fonction de compatibilité pour l'ancien code
export const saveIncomingMailToLocalStorage = async (mail: IncomingMail) => {
  try {
    const { id, ...mailData } = mail;
    await addIncomingMail(mailData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    throw error;
  }
};

// Export des fonctions du nouveau système
export { getAllIncomingMails, addIncomingMail, updateIncomingMail };

// Fonction de compatibilité pour l'édition
export const updateIncomingMailInLocalStorage = async (id: number, update: Partial<IncomingMail>) => {
  try {
    await updateIncomingMail(id, update);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return false;
  }
};
