
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock, CheckCircle } from "lucide-react";
import { IncomingMail, OutgoingMail } from "@/types/mail";

// Fonctions utilitaires pour lire les courriers depuis le localStorage
function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
    responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
  }));
}
function getAllOutgoingMails(): OutgoingMail[] {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
  }));
}

interface DashboardStatsProps {
  totalIncoming: number;
  totalOutgoing: number;
  pending: number;
  processed: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalIncoming, 
  totalOutgoing, 
  pending, 
  processed 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-agency-blue" />
          </div>
          <CardTitle className="text-xl mb-1">{totalIncoming}</CardTitle>
          <p className="text-gray-500 text-sm">Courriers Entrants</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Send className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-1">{totalOutgoing}</CardTitle>
          <p className="text-gray-500 text-sm">Courriers Départs</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <CardTitle className="text-xl mb-1">{pending}</CardTitle>
          <p className="text-gray-500 text-sm">En Attente</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-xl mb-1">{processed}</CardTitle>
          <p className="text-gray-500 text-sm">Traités</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
