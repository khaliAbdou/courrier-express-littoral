
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import OutgoingMailForm from "@/components/mail/OutgoingMailForm";
import MailTable from "@/components/mail/MailTable";
import { OutgoingMail } from "@/types/mail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { getAllOutgoingMails } from "@/utils/outgoingMailStorage";

const OutgoingMailPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMails, setFilteredMails] = useState<OutgoingMail[]>([]);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    const mails = getAllOutgoingMails();
    setFilteredMails(mails);
  }, [refresh]);

  const handleNewMail = () => {
    setRefresh((r) => r + 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const allMails = getAllOutgoingMails();
    const filtered = allMails.filter((mail) =>
      mail.chronoNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.correspondent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.service?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMails(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredMails(getAllOutgoingMails());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="page-container flex-1">
        <h1 className="page-title">Gestion des Courriers Départ</h1>
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
                    <Button variant="outline" onClick={resetSearch} type="button">
                      Réinitialiser
                    </Button>
                  )}
                </form>
              </div>
              <MailTable mails={filteredMails} type="outgoing" onMailUpdated={handleNewMail} />
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-0">
            <OutgoingMailForm onMailSaved={handleNewMail} />
          </TabsContent>
        </Tabs>
      </div>
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} ANOR - Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OutgoingMailPage;
