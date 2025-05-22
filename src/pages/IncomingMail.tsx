
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import IncomingMailForm from "@/components/mail/IncomingMailForm";
import MailTable from "@/components/mail/MailTable";
import { IncomingMail } from "@/types/mail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Mock data for demonstration
const mockIncomingMails: IncomingMail[] = [
  {
    id: "1",
    chronoNumber: "ARR-2023-0001",
    date: new Date(2023, 4, 15),
    medium: "Email",
    subject: "Demande d'attestation de conformité",
    mailType: "Administrative",
    responseDate: undefined,
    senderName: "Entreprise ABC",
    senderAddress: "123 Rue des Entreprises, Douala",
    recipientService: "Service Qualité",
    observations: "Urgent - Délai dépassé",
    status: "Overdue",
  },
  {
    id: "2",
    chronoNumber: "ARR-2023-0002",
    date: new Date(2023, 4, 20),
    medium: "Physical",
    subject: "Renouvellement certification",
    mailType: "Technical",
    responseDate: new Date(2023, 4, 25),
    senderName: "Société DEF",
    senderAddress: "789 Boulevard Principal, Douala",
    recipientService: "Service Certification",
    status: "Completed",
  },
  {
    id: "3",
    chronoNumber: "ARR-2023-0003",
    date: new Date(2023, 5, 1),
    medium: "Physical",
    subject: "Réclamation qualité produit",
    mailType: "Technical",
    responseDate: undefined,
    senderName: "Client XYZ",
    senderAddress: "456 Avenue du Commerce, Douala",
    recipientService: "Service Client",
    status: "Overdue",
  },
  {
    id: "4",
    chronoNumber: "ARR-2023-0004",
    date: new Date(2023, 5, 10),
    medium: "Email",
    subject: "Demande d'information normes",
    mailType: "Administrative",
    responseDate: undefined,
    senderName: "Etudiant Recherche",
    senderAddress: "Université de Douala",
    recipientService: "Service Information",
    status: "Processing",
  },
  {
    id: "5",
    chronoNumber: "ARR-2023-0005",
    date: new Date(2023, 5, 15),
    medium: "Email",
    subject: "Proposition de partenariat",
    mailType: "Commercial",
    responseDate: new Date(2023, 5, 20),
    senderName: "Entreprise Internationale",
    senderAddress: "Paris, France",
    recipientService: "Direction",
    status: "Completed",
  },
];

const IncomingMailPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMails, setFilteredMails] = useState<IncomingMail[]>(mockIncomingMails);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = mockIncomingMails.filter((mail) => 
      mail.chronoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.recipientService.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredMails(filtered);
  };
  
  const resetSearch = () => {
    setSearchTerm("");
    setFilteredMails(mockIncomingMails);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="page-container flex-1">
        <h1 className="page-title">Gestion des Courriers Entrants</h1>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list">Liste des Courriers</TabsTrigger>
            <TabsTrigger value="register">Enregistrer un Courrier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher par numéro, objet, expéditeur..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Rechercher</Button>
                  {searchTerm && (
                    <Button variant="outline" onClick={resetSearch}>
                      Réinitialiser
                    </Button>
                  )}
                </form>
              </div>
              
              <MailTable mails={filteredMails} type="incoming" />
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <IncomingMailForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default IncomingMailPage;
