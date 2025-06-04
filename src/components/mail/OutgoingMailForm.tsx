
import React, { useState } from "react";
import { MailMedium } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AuditLogger } from '@/utils/auditLogger';
import FormSection from "@/components/forms/FormSection";
import FormInput from "@/components/forms/FormInput";
import FormDatePicker from "@/components/forms/FormDatePicker";
import FormSelect from "@/components/forms/FormSelect";
import { Send, FileText, User, Building } from "lucide-react";

function saveOutgoingMailToLocalStorage(mail: any) {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push(mail);
  localStorage.setItem(key, JSON.stringify(mails));
}

interface OutgoingMailFormProps {
  onMailSaved?: () => void;
}

const OutgoingMailForm: React.FC<OutgoingMailFormProps> = ({ onMailSaved }) => {
  const [formData, setFormData] = useState({
    chronoNumber: "",
    date: new Date(),
    medium: "" as MailMedium,
    subject: "",
    correspondent: "",
    address: "",
    service: "",
    writer: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chronoNumber || !formData.subject || !formData.medium || 
        !formData.correspondent || !formData.service || !formData.writer) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const mailId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const mailWithId = { ...formData, id: mailId };

    saveOutgoingMailToLocalStorage(mailWithId);
    AuditLogger.logMailCreate('outgoing', mailId, formData.chronoNumber);

    if (onMailSaved) onMailSaved();

    toast.success("Courrier départ enregistré avec succès!");

    setFormData({
      chronoNumber: "",
      date: new Date(),
      medium: "" as MailMedium,
      subject: "",
      correspondent: "",
      address: "",
      service: "",
      writer: "",
      observations: "",
    });
  };

  const mediumOptions = [
    { value: "Email", label: "Email" },
    { value: "Physical", label: "Physique" },
    { value: "Fax", label: "Fax" },
    { value: "Other", label: "Autre" },
  ];

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
          {/* Informations générales */}
          <FormSection 
            title="Informations Générales" 
            icon={<FileText className="h-4 w-4" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="chronoNumber"
                label="Numéro de Chrono"
                value={formData.chronoNumber}
                onChange={handleInputChange}
                placeholder="Entrez le numéro chronologique"
                required
              />
              <FormDatePicker
                label="Date"
                date={formData.date}
                onDateChange={handleDateChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                id="medium"
                label="Support"
                value={formData.medium}
                onValueChange={(value) => handleSelectChange("medium", value)}
                placeholder="Sélectionnez le support"
                options={mediumOptions}
                required
              />
              <FormInput
                id="subject"
                label="Objet"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Entrez l'objet du courrier"
                required
              />
            </div>
          </FormSection>

          {/* Informations sur le destinataire */}
          <FormSection 
            title="Informations Destinataire" 
            icon={<User className="h-4 w-4" />}
            className="border-blue-200 bg-blue-50/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="correspondent"
                label="Nom du Destinataire"
                value={formData.correspondent}
                onChange={handleInputChange}
                placeholder="Entrez le nom du destinataire"
                required
              />
              <FormInput
                id="address"
                label="Adresse du Destinataire"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Entrez l'adresse complète"
              />
            </div>
          </FormSection>

          {/* Informations sur l'expéditeur */}
          <FormSection 
            title="Informations Expéditeur" 
            icon={<Building className="h-4 w-4" />}
            className="border-green-200 bg-green-50/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="service"
                label="Service Expéditeur"
                value={formData.service}
                onChange={handleInputChange}
                placeholder="Entrez le service expéditeur"
                required
              />
              <FormInput
                id="writer"
                label="Rédacteur"
                value={formData.writer}
                onChange={handleInputChange}
                placeholder="Entrez le nom du rédacteur"
                required
              />
            </div>
          </FormSection>

          {/* Observations */}
          <FormSection title="Observations Complémentaires">
            <div className="form-group">
              <label htmlFor="observations" className="form-label">
                Observations
              </label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Entrez des observations éventuelles"
                rows={3}
              />
            </div>
          </FormSection>

          <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
            <Button variant="outline" type="button" onClick={() => setFormData({
              chronoNumber: "",
              date: new Date(),
              medium: "" as MailMedium,
              subject: "",
              correspondent: "",
              address: "",
              service: "",
              writer: "",
              observations: "",
            })}>
              Réinitialiser
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default OutgoingMailForm;
