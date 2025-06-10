
import React, { useState } from "react";
import { format } from "date-fns";
import { OutgoingMail, MailMedium } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { updateOutgoingMailInLocalStorage } from "@/utils/outgoingMailStorage";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.chronoNumber ||
      !formData.subject ||
      !formData.medium ||
      !formData.correspondent ||
      !formData.service ||
      !formData.writer
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const success = updateOutgoingMailInLocalStorage(mail.id, formData);
    
    if (success) {
      toast.success("Courrier modifié avec succès!");
      onMailUpdated();
      onClose();
    } else {
      toast.error("Erreur lors de la modification du courrier.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Courrier Sortant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Numéro Chrono <span className="text-red-500">*</span>
              </label>
              <Input
                name="chronoNumber"
                value={formData.chronoNumber}
                onChange={handleInputChange}
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
                    onSelect={(date) => handleDateChange("date", date)}
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
                    onSelect={(date) => handleDateChange("issueDate", date)}
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
                onValueChange={(val) => handleSelectChange("medium", val)}
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
              onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse du Destinataire</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observations</label>
            <Textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOutgoingMailDialog;
