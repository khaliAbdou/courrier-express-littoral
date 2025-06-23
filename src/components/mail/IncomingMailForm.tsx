
import React, { useState } from "react";
import { MailMedium, MailType } from "@/types/mail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AuditLogger } from '@/utils/auditLogger';
import { addIncomingMail } from "@/utils/incomingMailDB";
import IncomingMailFormFields from "./incoming/IncomingMailFormFields";
import IncomingMailFormActions from "./incoming/IncomingMailFormActions";
import { Mail } from "lucide-react";

interface IncomingMailFormProps {
  onMailSaved?: () => void;
}

const IncomingMailForm: React.FC<IncomingMailFormProps> = ({ onMailSaved }) => {
  const [formData, setFormData] = useState({
    chronoNumber: "",
    date: new Date(),
    issueDate: undefined as Date | undefined,
    medium: "" as MailMedium,
    subject: "",
    senderName: "",
    senderAddress: "",
    recipientService: "",
    mailType: "" as MailType,
    responseDate: undefined as Date | undefined,
    observations: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleIssueDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, issueDate: date }));
  };

  const handleResponseDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, responseDate: date }));
  };

  const resetForm = () => {
    setFormData({
      chronoNumber: "",
      date: new Date(),
      issueDate: undefined,
      medium: "" as MailMedium,
      subject: "",
      senderName: "",
      senderAddress: "",
      recipientService: "",
      mailType: "" as MailType,
      responseDate: undefined,
      observations: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chronoNumber || !formData.subject || !formData.medium || 
        !formData.senderName || !formData.recipientService || !formData.mailType) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const mailToSave = { 
        ...formData, 
        status: "Pending" as const
      };

      const mailId = await addIncomingMail(mailToSave);
      AuditLogger.logMailCreate('incoming', mailId.toString(), formData.chronoNumber);

      if (onMailSaved) onMailSaved();

      toast.success("Courrier entrant enregistré avec succès!");
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement du courrier.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Enregistrer un Courrier Entrant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <IncomingMailFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onDateChange={handleDateChange}
            onIssueDateChange={handleIssueDateChange}
            onResponseDateChange={handleResponseDateChange}
          />
          <IncomingMailFormActions onReset={resetForm} />
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomingMailForm;
