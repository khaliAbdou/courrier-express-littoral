
import React from "react";
import { MailMedium, MailType } from "@/types/mail";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "@/components/forms/FormSection";
import FormInput from "@/components/forms/FormInput";
import FormDatePicker from "@/components/forms/FormDatePicker";
import FormSelect from "@/components/forms/FormSelect";
import { FileText, User, Building, Calendar } from "lucide-react";

interface FormData {
  chronoNumber: string;
  date: Date;
  issueDate?: Date;
  medium: MailMedium;
  subject: string;
  senderName: string;
  senderAddress: string;
  recipientService: string;
  mailType: MailType;
  responseDate?: Date;
  observations: string;
}

interface IncomingMailFormFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onIssueDateChange: (date: Date | undefined) => void;
  onResponseDateChange: (date: Date | undefined) => void;
}

const IncomingMailFormFields: React.FC<IncomingMailFormFieldsProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
  onIssueDateChange,
  onResponseDateChange,
}) => {
  const mediumOptions = [
    { value: "Email", label: "Email" },
    { value: "Physical", label: "Physique" },
    { value: "Fax", label: "Fax" },
    { value: "Other", label: "Autre" },
  ];

  const mailTypeOptions = [
    { value: "Administrative", label: "Administratif" },
    { value: "Technical", label: "Technique" },
    { value: "Commercial", label: "Commercial" },
    { value: "Financial", label: "Financier" },
    { value: "Other", label: "Autre" },
  ];

  return (
    <div className="space-y-6">
      <FormSection 
        title="Informations Générales" 
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="chronoNumber"
            label="Numéro de Chrono"
            value={formData.chronoNumber}
            onChange={onInputChange}
            placeholder="Entrez le numéro chronologique"
            required
          />
          <FormDatePicker
            label="Date d'enregistrement"
            date={formData.date}
            onDateChange={onDateChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDatePicker
            label="Date d'émission"
            date={formData.issueDate}
            onDateChange={onIssueDateChange}
          />
          <FormSelect
            id="medium"
            label="Support"
            value={formData.medium}
            onValueChange={(value) => onSelectChange("medium", value)}
            placeholder="Sélectionnez le support"
            options={mediumOptions}
            required
          />
        </div>
        <FormInput
          id="subject"
          label="Objet"
          value={formData.subject}
          onChange={onInputChange}
          placeholder="Entrez l'objet du courrier"
          required
        />
      </FormSection>

      <FormSection 
        title="Informations Expéditeur" 
        icon={<User className="h-4 w-4" />}
        className="border-blue-200 bg-blue-50/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="senderName"
            label="Nom de l'Expéditeur"
            value={formData.senderName}
            onChange={onInputChange}
            placeholder="Entrez le nom de l'expéditeur"
            required
          />
          <FormInput
            id="senderAddress"
            label="Adresse de l'Expéditeur"
            value={formData.senderAddress}
            onChange={onInputChange}
            placeholder="Entrez l'adresse complète"
          />
        </div>
      </FormSection>

      <FormSection 
        title="Informations Destinataire" 
        icon={<Building className="h-4 w-4" />}
        className="border-green-200 bg-green-50/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="recipientService"
            label="Service Destinataire"
            value={formData.recipientService}
            onChange={onInputChange}
            placeholder="Entrez le service destinataire"
            required
          />
          <FormSelect
            id="mailType"
            label="Type de Courrier"
            value={formData.mailType}
            onValueChange={(value) => onSelectChange("mailType", value)}
            placeholder="Sélectionnez le type"
            options={mailTypeOptions}
            required
          />
        </div>
      </FormSection>

      <FormSection 
        title="Suivi" 
        icon={<Calendar className="h-4 w-4" />}
        className="border-yellow-200 bg-yellow-50/50"
      >
        <FormDatePicker
          label="Date de Réponse"
          date={formData.responseDate}
          onDateChange={onResponseDateChange}
        />
      </FormSection>

      <FormSection title="Observations Complémentaires">
        <div className="form-group">
          <label htmlFor="observations" className="form-label">
            Observations
          </label>
          <Textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={onInputChange}
            placeholder="Entrez des observations éventuelles"
            rows={3}
          />
        </div>
      </FormSection>
    </div>
  );
};

export default IncomingMailFormFields;
