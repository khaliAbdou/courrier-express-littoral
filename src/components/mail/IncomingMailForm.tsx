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

// Fonction d'enregistrement dans le localStorage
function saveIncomingMailToLocalStorage(mail: any) {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  const mails = existing ? JSON.parse(existing) : [];
  mails.push(mail);
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
    if (!formData.chronoNumber || !formData.subject || !formData.medium ||
        !formData.mailType || !formData.senderName || !formData.recipientService) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Enregistre dans le localStorage
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
          {/* ... tout le reste du formulaire reste inchangé ... */}
          {/* Copie/colle ici tout le JSX du formulaire comme dans ton code actuel */}
          {/* ... */}
          <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
            <Button variant="outline" type="button" onClick={() => setFormData({
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
            })}>
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
