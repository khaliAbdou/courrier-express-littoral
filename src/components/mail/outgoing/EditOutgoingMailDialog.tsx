
import React, { useState } from "react";
import { OutgoingMail } from "@/types/mail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateOutgoingMail } from "@/utils/outgoingMailDB";
import EditOutgoingMailFormFields from "./EditOutgoingMailFormFields";
import EditOutgoingMailFormActions from "./EditOutgoingMailFormActions";

interface EditOutgoingMailDialogProps {
  mail: OutgoingMail;
  isOpen: boolean;
  onClose: () => void;
  onMailUpdated: () => void;
}

const EditOutgoingMailDialog: React.FC<EditOutgoingMailDialogProps> = ({
  mail,
  isOpen,
  onClose,
  onMailUpdated,
}) => {
  const [formData, setFormData] = useState({
    chronoNumber: mail.chronoNumber,
    date: mail.date,
    issueDate: mail.issueDate,
    medium: mail.medium,
    subject: mail.subject,
    correspondent: mail.correspondent,
    address: mail.address,
    service: mail.service,
    writer: mail.writer,
    observations: mail.observations || "",
    status: mail.status,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.chronoNumber ||
      !formData.subject ||
      !formData.medium ||
      !formData.correspondent ||
      !formData.service ||
      !formData.writer
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (mail.id) {
        await updateOutgoingMail(mail.id, formData);
        toast.success("Courrier modifié avec succès!");
        onMailUpdated();
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification du courrier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Courrier Sortant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EditOutgoingMailFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onDateChange={handleDateChange}
          />
          <EditOutgoingMailFormActions
            onClose={onClose}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOutgoingMailDialog;
