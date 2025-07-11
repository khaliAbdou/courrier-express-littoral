
import React from "react";
import { MailMedium } from "@/types/mail";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "@/components/forms/FormSection";
import FormInput from "@/components/forms/FormInput";
import FormDatePicker from "@/components/forms/FormDatePicker";
import FormSelect from "@/components/forms/FormSelect";
import { FileText, User, Building } from "lucide-react";

interface FormData {
  chronoNumber: string;
  date: Date;
  issueDate?: Date;
  medium: MailMedium;
  subject: string;
  correspondent: string;
  address: string;
  service: string;
  writer: string;
  observations: string;
}

interface OutgoingMailFormFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onIssueDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

const OutgoingMailFormFields: React.FC<OutgoingMailFormFieldsProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
  onIssueDateChange,
  disabled = false,
}) => {
  const mediumOptions = [
    { value: "Email", label: "Email" },
    { value: "Physical", label: "Physique" },
    { value: "Fax", label: "Fax" },
    { value: "Other", label: "Autre" },
  ];

  return (
    <div className="space-y-6">
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
            onChange={onInputChange}
            placeholder="Entrez le numéro chronologique"
            required
            disabled={disabled}
          />
          <FormDatePicker
            label="Date d'enregistrement"
            date={formData.date}
            onDateChange={onDateChange}
            required
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDatePicker
            label="Date d'émission"
            date={formData.issueDate}
            onDateChange={onIssueDateChange}
            disabled={disabled}
          />
          <FormSelect
            id="medium"
            label="Support"
            value={formData.medium}
            onValueChange={(value) => onSelectChange("medium", value)}
            placeholder="Sélectionnez le support"
            options={mediumOptions}
            required
            disabled={disabled}
          />
        </div>
        <FormInput
          id="subject"
          label="Objet"
          value={formData.subject}
          onChange={onInputChange}
          placeholder="Entrez l'objet du courrier"
          required
          disabled={disabled}
        />
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
            onChange={onInputChange}
            placeholder="Entrez le nom du destinataire"
            required
            disabled={disabled}
          />
          <FormInput
            id="address"
            label="Adresse du Destinataire"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Entrez l'adresse complète"
            disabled={disabled}
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
            onChange={onInputChange}
            placeholder="Entrez le service expéditeur"
            required
            disabled={disabled}
          />
          <FormInput
            id="writer"
            label="Rédacteur"
            value={formData.writer}
            onChange={onInputChange}
            placeholder="Entrez le nom du rédacteur"
            required
            disabled={disabled}
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
            onChange={onInputChange}
            placeholder="Entrez des observations éventuelles"
            rows={3}
            disabled={disabled}
          />
        </div>
      </FormSection>
    </div>
  );
};

export default OutgoingMailFormFields;
