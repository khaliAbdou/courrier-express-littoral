
import React, { useState } from "react";
import { format } from "date-fns";
import { MailMedium, MailType, ScannedDocument } from "@/types/mail";
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
import { AuditLogger } from '@/utils/auditLogger';
import { saveIncomingMailToLocalStorage } from "@/utils/incomingMailStorage";
import FileUploadSection from "@/components/forms/FileUploadSection";

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
    mailType: "" as MailType,
    responseDate: undefined as Date | undefined,
    senderName: "",
    senderAddress: "",
    recipientService: "",
    observations: "",
    scannedDocuments: [] as ScannedDocument[],
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

  const handleDocumentsChange = (documents: ScannedDocument[]) => {
    setFormData((prev) => ({ ...prev, scannedDocuments: documents }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      const mailId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const mailWithId = { ...formData, id: mailId };

      await saveIncomingMailToLocalStorage(mailWithId);
      AuditLogger.logMailCreate('incoming', mailId, formData.chronoNumber);

      if (onMailSaved) onMailSaved();

      toast.success("Courrier entrant enregistré avec succès!");

      setFormData({
        chronoNumber: "",
        date: new Date(),
        issueDate: undefined,
        medium: "" as MailMedium,
        subject: "",
        mailType: "" as MailType,
        responseDate: undefined,
        senderName: "",
        senderAddress: "",
        recipientService: "",
        observations: "",
        scannedDocuments: [],
      });
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
        <CardTitle>Enregistrer un Courrier Entrant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Première ligne : Numéro Chrono et Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Numéro Chrono <span className="text-red-500">*</span>
              </label>
              <Input
                name="chronoNumber"
                value={formData.chronoNumber}
                onChange={handleInputChange}
                placeholder="Entrez le numéro chronologique"
                required
                disabled={isSubmitting}
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
                    disabled={isSubmitting}
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

          {/* Date d'émission */}
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
                    disabled={isSubmitting}
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
          </div>

          {/* Deuxième ligne : Moyen et Type */}
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

          {/* Troisième ligne : Objet */}
          <div className="form-group">
            <label className="form-label">
              Objet <span className="text-red-500">*</span>
            </label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Entrez l'objet du courrier"
              required
            />
          </div>

          {/* Quatrième ligne : Expéditeur et Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Nom de l'expéditeur <span className="text-red-500">*</span>
              </label>
              <Input
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                placeholder="Entrez le nom de l'expéditeur"
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
                placeholder="Entrez le service destinataire"
                required
              />
            </div>
          </div>

          {/* Cinquième ligne : Adresse expéditeur et Date de réponse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Adresse de l'expéditeur</label>
              <Input
                name="senderAddress"
                value={formData.senderAddress}
                onChange={handleInputChange}
                placeholder="Entrez l'adresse de l'expéditeur"
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

          {/* Observations */}
          <div className="form-group">
            <label className="form-label">Observations</label>
            <Textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              placeholder="Entrez des observations éventuelles"
              rows={3}
            />
          </div>

          {/* Documents scannés */}
          <FileUploadSection
            documents={formData.scannedDocuments}
            onDocumentsChange={handleDocumentsChange}
            disabled={isSubmitting}
          />

          <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() =>
              setFormData({
                chronoNumber: "",
                date: new Date(),
                issueDate: undefined,
                medium: "" as MailMedium,
                subject: "",
                mailType: "" as MailType,
                responseDate: undefined,
                senderName: "",
                senderAddress: "",
                recipientService: "",
                observations: "",
                scannedDocuments: [],
              })
              }
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomingMailForm;
