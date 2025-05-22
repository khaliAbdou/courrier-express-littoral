
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

const IncomingMailForm: React.FC = () => {
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
    
    // Here we would normally save the data to the database
    console.log("Form submitted with data:", formData);
    
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="chronoNumber" className="form-label">
                Numéro de Chrono *
              </label>
              <Input
                id="chronoNumber"
                name="chronoNumber"
                value={formData.chronoNumber}
                onChange={handleInputChange}
                placeholder="Entrez le numéro chronologique"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "dd/MM/yyyy") : <span>Sélectionnez une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <label htmlFor="medium" className="form-label">
                Support *
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange("medium", value)}
                value={formData.medium}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le support" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Physical">Physique</SelectItem>
                  <SelectItem value="Fax">Fax</SelectItem>
                  <SelectItem value="Other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-group">
              <label htmlFor="mailType" className="form-label">
                Type de Courrier *
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange("mailType", value)}
                value={formData.mailType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
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
            <label htmlFor="subject" className="form-label">
              Objet *
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Entrez l'objet du courrier"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="senderName" className="form-label">
                Nom de l'Expéditeur *
              </label>
              <Input
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                placeholder="Entrez le nom de l'expéditeur"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="senderAddress" className="form-label">
                Adresse de l'Expéditeur
              </label>
              <Input
                id="senderAddress"
                name="senderAddress"
                value={formData.senderAddress}
                onChange={handleInputChange}
                placeholder="Entrez l'adresse de l'expéditeur"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="recipientService" className="form-label">
                Service Destinataire *
              </label>
              <Input
                id="recipientService"
                name="recipientService"
                value={formData.recipientService}
                onChange={handleInputChange}
                placeholder="Entrez le service destinataire"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Date de Réponse</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.responseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.responseDate ? format(formData.responseDate, "dd/MM/yyyy") : <span>À remplir après traitement</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
            <label htmlFor="observations" className="form-label">
              Observations
            </label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              placeholder="Entrez des observations éventuelles"
              className="h-20"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="documentLink" className="form-label">
              Fichier Numérisé
            </label>
            <Input
              id="documentLink"
              name="documentLink"
              type="file"
              className="cursor-pointer"
              onChange={(e) => {
                // Handle file upload
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  // Here we would usually upload the file and get a URL back
                  // For now we'll just store the file name
                  setFormData((prev) => ({ ...prev, documentLink: files[0].name }));
                }
              }}
            />
          </div>
          
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
