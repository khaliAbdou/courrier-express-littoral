
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface IncomingMailFormActionsProps {
  onReset: () => void;
}

const IncomingMailFormActions: React.FC<IncomingMailFormActionsProps> = ({
  onReset,
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
      <Button variant="outline" type="button" onClick={onReset}>
        Réinitialiser
      </Button>
      <Button type="submit">
        <Mail className="h-4 w-4 mr-2" />
        Enregistrer
      </Button>
    </CardFooter>
  );
};

export default IncomingMailFormActions;
