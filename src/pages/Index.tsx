
import React from "react";
import Navbar from "@/components/layout/Navbar";
import OverdueMail from "@/components/dashboard/OverdueMail";
import { IncomingMail, OutgoingMail } from "@/types/mail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock, CheckCircle } from "lucide-react";

// Mock data for demonstration
const mockOverdueMails: IncomingMail[] = [
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
];

const Index: React.FC = () => {
  // In a real application, these stats would come from the database
  const stats = {
    totalIncoming: 45,
    totalOutgoing: 38,
    pending: 12,
    processed: 71,
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="page-container flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Tableau de Bord</h1>
          <p className="text-gray-500">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-agency-blue" />
              </div>
              <CardTitle className="text-xl mb-1">{stats.totalIncoming}</CardTitle>
              <p className="text-gray-500 text-sm">Courriers Entrants</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl mb-1">{stats.totalOutgoing}</CardTitle>
              <p className="text-gray-500 text-sm">Courriers Départs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle className="text-xl mb-1">{stats.pending}</CardTitle>
              <p className="text-gray-500 text-sm">En Attente</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl mb-1">{stats.processed}</CardTitle>
              <p className="text-gray-500 text-sm">Traités</p>
            </CardContent>
          </Card>
        </div>
        
        <OverdueMail overdueEmails={mockOverdueMails} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-agency-blue">Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i % 2 === 0 ? "bg-blue-100" : "bg-green-100"
                    }`}>
                      {i % 2 === 0 ? (
                        <Mail className={`h-4 w-4 ${i % 2 === 0 ? "text-agency-blue" : "text-green-600"}`} />
                      ) : (
                        <Send className={`h-4 w-4 ${i % 2 === 0 ? "text-agency-blue" : "text-green-600"}`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{
                        i % 2 === 0 
                          ? "Nouveau courrier entrant enregistré" 
                          : "Nouveau courrier départ enregistré"
                      }</p>
                      <p className="text-sm text-gray-500">Il y a {(i + 1) * 2} heures</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-agency-blue">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="/incoming" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Mail className="h-10 w-10 text-agency-blue mb-2" />
                  <span className="text-center">Enregistrer un Courrier Entrant</span>
                </a>
                <a 
                  href="/outgoing" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Send className="h-10 w-10 text-green-600 mb-2" />
                  <span className="text-center">Enregistrer un Courrier Départ</span>
                </a>
                <a 
                  href="/statistics" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-purple-50 transition-colors col-span-2"
                >
                  <Mail className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="text-center">Voir les Statistiques</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ANOR - Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
