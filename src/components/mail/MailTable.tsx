
import React, { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { BaseMail, IncomingMail, OutgoingMail } from "@/types/mail";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditIncomingMailDialog from "./incoming/EditIncomingMailDialog";
import EditOutgoingMailDialog from "./outgoing/EditOutgoingMailDialog";
import ScannedDocumentViewer from "./ScannedDocumentViewer";
import { deleteIncomingMail } from "@/utils/incomingMailStorage";
import { deleteOutgoingMail } from "@/utils/outgoingMailStorage";
import { toast } from "sonner";

interface MailTableProps {
  mails: (IncomingMail | OutgoingMail)[];
  type: "incoming" | "outgoing";
  onMailUpdated?: () => void;
}

const MailTable: React.FC<MailTableProps> = ({ mails, type, onMailUpdated }) => {
  const [editingMail, setEditingMail] = useState<IncomingMail | OutgoingMail | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingMailId, setDeletingMailId] = useState<string | null>(null);

  const handleEditClick = (mail: IncomingMail | OutgoingMail) => {
    setEditingMail(mail);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingMail(null);
  };

  const handleMailUpdated = () => {
    if (onMailUpdated) {
      onMailUpdated();
    }
  };

  const handleDeleteClick = async (mailId: string) => {
    try {
      let success = false;
      if (type === "incoming") {
        success = await deleteIncomingMail(mailId);
      } else {
        success = await deleteOutgoingMail(mailId);
      }

      if (success) {
        toast.success("Courrier supprimé avec succès!");
        handleMailUpdated();
      } else {
        toast.error("Erreur lors de la suppression du courrier.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du courrier.");
    }
    setDeletingMailId(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            <TableRow className="bg-agency-lightgray">
              <TableHead className="px-4 py-2 text-left">N° Chrono</TableHead>
              <TableHead className="px-4 py-2 text-left">Date</TableHead>
              <TableHead className="px-4 py-2 text-left">Date d'émission</TableHead>
              <TableHead className="px-4 py-2 text-left">Objet</TableHead>
              {type === "incoming" ? (
                <>
                  <TableHead className="px-4 py-2 text-left">Expéditeur</TableHead>
                  <TableHead className="px-4 py-2 text-left">Service Destinataire</TableHead>
                  <TableHead className="px-4 py-2 text-left">Type</TableHead>
                  <TableHead className="px-4 py-2 text-left">Date de Réponse</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="px-4 py-2 text-left">Correspondant</TableHead>
                  <TableHead className="px-4 py-2 text-left">Service</TableHead>
                  <TableHead className="px-4 py-2 text-left">Rédacteur</TableHead>
                </>
              )}
              <TableHead className="px-4 py-2 text-left">Statut</TableHead>
              <TableHead className="px-4 py-2 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === "incoming" ? 9 : 8} className="text-center py-4 text-gray-500">
                  Aucun courrier trouvé
                </TableCell>
              </TableRow>
            ) : (
              mails.map((mail) => {
                const isOverdue = mail.status === "Overdue";
                return (
                  <React.Fragment key={mail.id}>
                    <TableRow 
                      className={`${
                        isOverdue ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                    <TableCell className="px-4 py-2 border-b">{mail.chronoNumber}</TableCell>
                    <TableCell className="px-4 py-2 border-b">
                      {format(new Date(mail.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="px-4 py-2 border-b">
                      {mail.issueDate ? format(new Date(mail.issueDate), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-2 border-b">{mail.subject}</TableCell>
                    {type === "incoming" ? (
                      <>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as IncomingMail).senderName}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as IncomingMail).recipientService}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as IncomingMail).mailType}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as IncomingMail).responseDate
                            ? format(new Date((mail as IncomingMail).responseDate!), "dd/MM/yyyy")
                            : "Non traité"}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as OutgoingMail).correspondent}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as OutgoingMail).service}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-b">
                          {(mail as OutgoingMail).writer}
                        </TableCell>
                      </>
                    )}
                    <TableCell 
                      className={`px-4 py-2 border-b ${
                        isOverdue ? "text-agency-red font-bold" : ""
                      }`}
                    >
                      {mail.status}
                      {isOverdue && " ⚠️"}
                    </TableCell>
                    <TableCell className="px-4 py-2 border-b">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          title="Modifier"
                          onClick={() => handleEditClick(mail)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce courrier ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClick(mail.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Affichage des documents scannés */}
                  {mail.scannedDocuments && mail.scannedDocuments.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={type === "incoming" ? 9 : 8} className="px-4 py-2 bg-muted/30">
                        <ScannedDocumentViewer documents={mail.scannedDocuments} />
                      </TableCell>
                    </TableRow>
                  )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs d'édition */}
      {editingMail && type === "incoming" && (
        <EditIncomingMailDialog
          mail={editingMail as IncomingMail}
          isOpen={isEditDialogOpen}
          onClose={handleEditDialogClose}
          onMailUpdated={handleMailUpdated}
        />
      )}

      {editingMail && type === "outgoing" && (
        <EditOutgoingMailDialog
          mail={editingMail as OutgoingMail}
          isOpen={isEditDialogOpen}
          onClose={handleEditDialogClose}
          onMailUpdated={handleMailUpdated}
        />
      )}
    </>
  );
};

export default MailTable;
