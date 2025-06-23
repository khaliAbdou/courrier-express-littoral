
import React from "react";
import { format } from "date-fns";
import { MailMedium } from "@/types/mail";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface EditFormData {
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
  status: string;
}

interface EditOutgoingMailFormFieldsProps {
  formData: EditFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (name: string, date: Date | undefined) => void;
}

const EditOutgoingMailFormFields: React.FC<EditOutgoingMailFormFieldsProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            Numéro Chrono <span className="text-red-500">*</span>
          </label>
          <Input
            name="chronoNumber"
            value={formData.chronoNumber}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Date d'enregistrement <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => onDateChange("date", date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Date d'émission</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.issueDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.issueDate ? format(formData.issueDate, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.issueDate}
                onSelect={(date) => onDateChange("issueDate", date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="form-group">
          <label className="form-label">
            Support <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.medium}
            onValueChange={(val) => onSelectChange("medium", val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le support" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Physical">Physique</SelectItem>
              <SelectItem value="Fax">Fax</SelectItem>
              <SelectItem value="Other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Objet <span className="text-red-500">*</span>
        </label>
        <Input
          name="subject"
          value={formData.subject}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            Nom du Destinataire <span className="text-red-500">*</span>
          </label>
          <Input
            name="correspondent"
            value={formData.correspondent}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Adresse du Destinataire</label>
          <Input
            name="address"
            value={formData.address}
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            Service Expéditeur <span className="text-red-500">*</span>
          </label>
          <Input
            name="service"
            value={formData.service}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Rédacteur <span className="text-red-500">*</span>
          </label>
          <Input
            name="writer"
            value={formData.writer}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Observations</label>
        <Textarea
          name="observations"
          value={formData.observations}
          onChange={onInputChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default EditOutgoingMailFormFields;
