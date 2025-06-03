
import { toast } from "sonner";

export const printHomePage = () => {
  try {
    // Ouvrir la page d'accueil dans une nouvelle fenêtre
    const printWindow = window.open('/', '_blank');
    
    if (printWindow) {
      // Attendre que la page soit chargée avant de lancer l'impression
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Fermer la fenêtre après l'impression
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 1000);
      };
      toast.success("Impression de la page d'accueil lancée !");
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  } catch (error) {
    toast.error("Erreur lors du lancement de l'impression");
  }
};
