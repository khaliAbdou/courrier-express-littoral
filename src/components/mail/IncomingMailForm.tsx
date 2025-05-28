import React, { useState } from "react";
import { format } from "date-fns";
import { MailMedium, MailType } from "@/types/mail";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

// Fonction d'enregistrement dans le localStorage (avec status)
function saveIncomingMailToLocalStorage(mail: any) {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push({ ...mail, status: "Processing" }); // Ajout du status par défaut
  localStorage.setItem(key, JSON.stringify(mails));
}

// Ajoute la prop onMailSaved
interface IncomingMailFormProps {
  onMailSaved?: () => void;
}

const IncomingMailForm: React.FC<IncomingMailFormProps> = ({ onMailSaved }) => {
  const [formData, setFormData] = useState({
    chronoNumber: "",
    date: new Date(),
    medium: "" as MailMedium,
    subject: "",
    mailType: "" as MailType,
    responseDate: undefined as Date | undefined,
    senderName: "",
    senderAddress: "",
    recipientService: "",
    observations: "",
    documentLink: "",
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

    // Validate form
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

    // Enregistre dans le localStorage (avec status)
    saveIncomingMailToLocalStorage(formData);

    // Rafraîchir la liste si le parent fournit la prop
    if (onMailSaved) onMailSaved();

    toast.success("Courrier entrant enregistré avec succès!");

    // Reset form
    setFormData({
      chronoNumber: "",
      date: new Date(),
      medium: "" as MailMedium,
      subject: "",
      mailType: "" as MailType,
      responseDate: undefined,
      senderName: "",
      senderAddress: "",
      recipientService: "",
      observations: "",
      documentLink: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enregistrer un Courrier Entrant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Numéro Chrono */}
          <div>
            <label className="block font-medium mb-1">
              Numéro Chrono <span className="text-red-500">*</span>
            </label>
            <Input
              name="chronoNumber"
              value={formData.chronoNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Date d'arrivée */}
          <div>
            <label className="block font-medium mb-1">Date d'arrivée <span className="text-red-500">*</span></label>
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
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Moyen de réception */}
          <div>
            <label className="block font-medium mb-1">
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

          {/* Objet */}
          <div>
            <label className="block font-medium mb-1">
              Objet <span className="text-red-500">*</span>
            </label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Type de courrier */}
          <div>
            <label className="block font-medium mb-1">
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

          {/* Date de réponse (optionnelle) */}
          <div>
            <label className="block font-medium mb-1">Date de réponse</label>
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
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Expéditeur */}
          <div>
            <label className="block font-medium mb-1">
              Nom de l'expéditeur <span className="text-red-500">*</span>
            </label>
            <Input
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Adresse de l'expéditeur</label>
            <Input
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleInputChange}
            />
          </div>

          {/* Service destinataire */}
          <div>
            <label className="block font-medium mb-1">
              Service destinataire <span className="text-red-500">*</span>
            </label>
            <Input
              name="recipientService"
              value={formData.recipientService}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Observations */}
          <div>
            <label className="block font-medium mb-1">Observations</label>
            <Textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          {/* Lien document (optionnel) */}
          <div>
            <label className="block font-medium mb-1">Lien vers document</label>
            <Input
              name="documentLink"
              value={formData.documentLink}
              onChange={handleInputChange}
            />
          </div>

          <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setFormData({
                  chronoNumber: "",
                  date: new Date(),
                  medium: "" as MailMedium,
                  subject: "",
                  mailType: "" as MailType,
                  responseDate: undefined,
                  senderName: "",
                  senderAddress: "",
                  recipientService: "",
                  observations: "",
                  documentLink: "",
                })
              }
            >
              Réinitialiser
            </Button>
            <Button type="submit">Enregistrer</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomingMailForm;
