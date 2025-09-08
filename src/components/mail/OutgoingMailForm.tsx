
import React, { useState } from "react";
import { MailMedium } from "@/types/mail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AuditLogger } from '@/utils/auditLogger';
import { saveOutgoingMail } from "@/utils/storageAdapter";
import OutgoingMailFormFields from "./outgoing/OutgoingMailFormFields";
import OutgoingMailFormActions from "./outgoing/OutgoingMailFormActions";
import { Send } from "lucide-react";

interface OutgoingMailFormProps {
  onMailSaved?: () => void;
}

const OutgoingMailForm: React.FC<OutgoingMailFormProps> = ({ onMailSaved }) => {
  const [formData, setFormData] = useState({
    chronoNumber: "",
    date: new Date(),
    issueDate: undefined as Date | undefined,
    medium: "" as MailMedium,
    subject: "",
    correspondent: "",
    address: "",
    service: "",
    writer: "",
    observations: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const resetForm = () => {
    setFormData({
      chronoNumber: "",
      date: new Date(),
      issueDate: undefined,
      medium: "" as MailMedium,
      subject: "",
      correspondent: "",
      address: "",
      service: "",
      writer: "",
      observations: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chronoNumber || !formData.subject || !formData.medium || 
        !formData.correspondent || !formData.service || !formData.writer) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);

    try {
      const mailId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const mailWithId = { ...formData, id: mailId, status: "Processing" };

      await saveOutgoingMail(mailWithId);
      AuditLogger.logMailCreate('outgoing', mailId, formData.chronoNumber);

      if (onMailSaved) onMailSaved();

      toast.success("Courrier départ enregistré avec succès!");
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du courrier.");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Enregistrer un Courrier Départ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <OutgoingMailFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onDateChange={handleDateChange}
            onIssueDateChange={handleIssueDateChange}
            disabled={isSubmitting}
          />
          <OutgoingMailFormActions 
            onReset={resetForm} 
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default OutgoingMailForm;
