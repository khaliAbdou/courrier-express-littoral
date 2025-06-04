
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import { MailMedium } from "@/types/mail";

interface FormData {
  chronoNumber: string;
  date: Date;
  medium: MailMedium;
  subject: string;
  correspondent: string;
  address: string;
  service: string;
  writer: string;
  observations: string;
}

interface OutgoingMailFormActionsProps {
  onReset: () => void;
}

const OutgoingMailFormActions: React.FC<OutgoingMailFormActionsProps> = ({
  onReset,
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
      <Button variant="outline" type="button" onClick={onReset}>
        Réinitialiser
      </Button>
      <Button type="submit">
        <Send className="h-4 w-4 mr-2" />
        Enregistrer
      </Button>
    </CardFooter>
  );
};

export default OutgoingMailFormActions;
