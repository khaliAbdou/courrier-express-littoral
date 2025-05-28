
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";
import OverdueMail from "@/components/dashboard/OverdueMail";
import { IncomingMail, OutgoingMail } from "@/types/mail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock, CheckCircle, Filter, ArrowUpDown } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

// Données pour les statistiques par type de courrier
const mailTypeData = [
  { name: "Administratif", value: 25, color: "#4f46e5" },
  { name: "Technique", value: 15, color: "#10b981" },
  { name: "Commercial", value: 12, color: "#f59e0b" },
  { name: "Financier", value: 8, color: "#6366f1" },
  { name: "Autre", value: 5, color: "#8b5cf6" },
];

// Données pour les statistiques mensuelles
const monthlyData = [
  { name: "Jan", incoming: 12, outgoing: 10 },
  { name: "Fév", incoming: 15, outgoing: 12 },
  { name: "Mar", incoming: 18, outgoing: 15 },
  { name: "Avr", incoming: 14, outgoing: 18 },
  { name: "Mai", incoming: 20, outgoing: 17 },
  { name: "Juin", incoming: 22, outgoing: 20 },
];

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

// Fonction pour récupérer les statistiques depuis Supabase
const fetchMailStats = async () => {
  try {
    const { data, error } = await supabase
      .from("mail_statistics")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(6);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return null;
  }
};

// Fonction pour récupérer les courriers en retard
const fetchOverdueMails = async (): Promise<IncomingMail[]> => {
  try {
    const { data, error } = await supabase
      .from("overdue_mail_view")
      .select("*")
      .order("date", { ascending: false });
      
    if (error) throw error;
    
    // Transformation des données Supabase (snake_case) vers le format TypeScript (camelCase)
    return (data || []).map(item => ({
      id: item.id,
      chronoNumber: item.chrono_number,
      date: new Date(item.date),
      medium: item.medium,
      subject: item.subject,
      mailType: item.mail_type,
      responseDate: item.response_date ? new Date(item.response_date) : undefined,
      senderName: item.sender_name,
      senderAddress: item.sender_address,
      recipientService: item.recipient_service,
      observations: item.observations,
      documentLink: item.document_link,
      status: item.status,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers en retard:", error);
    return [];
  }
};

const Index: React.FC = () => {
  const { data: mailStats, isLoading: statsLoading } = useQuery({
    queryKey: ["mailStats"],
    queryFn: fetchMailStats,
  });
  
  const { data: overdueMails, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdueMails"],
    queryFn: fetchOverdueMails,
  });
  
  // Gestion des erreurs via React Error Boundary ou useEffect si nécessaire
  React.useEffect(() => {
    if (mailStats === null) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  }, [mailStats]);
  
  // Stats calculées (utiliser les vraies données ou les mock si non disponibles)
  const stats = {
    totalIncoming: mailStats?.reduce((sum, stat) => sum + stat.incoming_count, 0) || 45,
    totalOutgoing: mailStats?.reduce((sum, stat) => sum + stat.outgoing_count, 0) || 38,
    pending: 12, // À calculer en fonction des statuts réels
    processed: 71, // À calculer en fonction des statuts réels
  };
  
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-0">Tableau de Bord</h1>
          <p className="text-gray-500">
            {formattedDateCapitalized}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-agency-blue flex items-center justify-between">
                <span>Tendance Mensuelle</span>
                <Filter className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incoming" name="Entrants" fill="#4f46e5" />
                    <Bar dataKey="outgoing" name="Départs" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-agency-blue flex items-center justify-between">
                <span>Répartition par Type</span>
                <ArrowUpDown className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mailTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mailTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <OverdueMail overdueEmails={overdueMails || mockOverdueMails} />
        
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/incoming" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Mail className="h-10 w-10 text-agency-blue mb-2" />
                  <span className="text-center">Enregistrer un Courrier Entrant</span>
                </Link>
                <Link 
                  to="/outgoing" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Send className="h-10 w-10 text-green-600 mb-2" />
                  <span className="text-center">Enregistrer un Courrier Départ</span>
                </Link>
                <Link 
                  to="/statistics" 
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-purple-50 transition-colors col-span-1 sm:col-span-2"
                >
                  <BarChart className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="text-center">Voir les Statistiques</span>
                </Link>
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
