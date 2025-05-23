
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import OutgoingMailForm from "@/components/mail/OutgoingMailForm";
import MailTable from "@/components/mail/MailTable";
import { OutgoingMail } from "@/types/mail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Mock data for demonstration
const mockOutgoingMails: OutgoingMail[] = [
  {
    id: "1",
    chronoNumber: "DEP-2023-0001",
    date: new Date(2023, 4, 16),
    medium: "Email",
    subject: "Réponse à la demande de certification",
    correspondent: "Entreprise ABC",
    address: "123 Rue des Entreprises, Douala",
    service: "Service Certification",
    writer: "Jean Dupont",
    observations: "Dossier complet",
    status: "Completed",
  },
  {
    id: "2",
    chronoNumber: "DEP-2023-0002",
    date: new Date(2023, 4, 22),
    medium: "Physical",
    subject: "Attestation de conformité",
    correspondent: "Société DEF",
    address: "789 Boulevard Principal, Douala",
    service: "Service Qualité",
    writer: "Marie Claire",
    observations: "Remise en main propre",
    status: "Completed",
  },
  {
    id: "3",
    chronoNumber: "DEP-2023-0003",
    date: new Date(2023, 5, 5),
    medium: "Email",
    subject: "Convocation réunion technique",
    correspondent: "Partenaires techniques",
    address: "Diverses adresses",
    service: "Direction Technique",
    writer: "Paul Martin",
    observations: "Réunion le 15/06/2023",
    status: "Completed",
  },
  {
    id: "4",
    chronoNumber: "DEP-2023-0004",
    date: new Date(2023, 5, 12),
    medium: "Email",
    subject: "Documentation normes techniques",
    correspondent: "Université de Douala",
    address: "Campus universitaire, Douala",
    service: "Service Documentation",
    writer: "Anne Sophie",
    status: "Completed",
  },
  {
    id: "5",
    chronoNumber: "DEP-2023-0005",
    date: new Date(2023, 5, 18),
    medium: "Physical",
    subject: "Contrat de partenariat",
    correspondent: "Entreprise Internationale",
    address: "Paris, France",
    service: "Direction",
    writer: "Jacques Bernard",
    observations: "Envoi par courrier express",
    status: "Processing",
  },
];

const OutgoingMailPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMails, setFilteredMails] = useState<OutgoingMail[]>(mockOutgoingMails);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = mockOutgoingMails.filter((mail) => 
      mail.chronoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.correspondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.writer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredMails(filtered);
  };
  
  const resetSearch = () => {
    setSearchTerm("");
    setFilteredMails(mockOutgoingMails);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="page-container flex-1">
        <h1 className="page-title">Gestion des Courriers Départs</h1>
        
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
                      placeholder="Rechercher par numéro, objet, correspondant..."
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
              
              <MailTable mails={filteredMails} type="outgoing" />
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <OutgoingMailForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ANOR - Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default OutgoingMailPage;
