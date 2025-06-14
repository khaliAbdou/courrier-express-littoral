import React, { useState } from "react";
import { format } from "date-fns";
import { IncomingMail, MailMedium, MailType } from "@/types/mail";
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
import { updateIncomingMailInLocalStorage } from "@/utils/incomingMailStorage";

interface EditIncomingMailDialogProps {
  mail: IncomingMail;
  isOpen: boolean;
  onClose: () => void;
  onMailUpdated: () => void;
}

const EditIncomingMailDialog: React.FC<EditIncomingMailDialogProps> = ({
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
    mailType: mail.mailType,
    responseDate: mail.responseDate,
    senderName: mail.senderName,
    senderAddress: mail.senderAddress,
    recipientService: mail.recipientService,
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
      !formData.mailType ||
      !formData.senderName ||
      !formData.recipientService
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const success = updateIncomingMailInLocalStorage(mail.id, formData);
    
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
          <DialogTitle>Modifier le Courrier Entrant</DialogTitle>
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
                Date d'arrivée <span className="text-red-500">*</span>
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
                Statut <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange("status", val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Processing">En cours</SelectItem>
                  <SelectItem value="Completed">Terminé</SelectItem>
                  <SelectItem value="Overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Moyen de réception <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.medium}
                onValueChange={(val) => handleSelectChange("medium", val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un moyen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physical">Physique</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Fax">Fax</SelectItem>
                  <SelectItem value="Other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Type de courrier <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.mailType}
                onValueChange={(val) => handleSelectChange("mailType", val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrative">Administratif</SelectItem>
                  <SelectItem value="Technical">Technique</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Financial">Financier</SelectItem>
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
                Nom de l'expéditeur <span className="text-red-500">*</span>
              </label>
              <Input
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Service destinataire <span className="text-red-500">*</span>
              </label>
              <Input
                name="recipientService"
                value={formData.recipientService}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Adresse de l'expéditeur</label>
              <Input
                name="senderAddress"
                value={formData.senderAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date de réponse</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.responseDate && "text-muted-foreground"
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.responseDate ? format(formData.responseDate, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.responseDate}
                    onSelect={(date) => handleDateChange("responseDate", date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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

export default EditIncomingMailDialog;
