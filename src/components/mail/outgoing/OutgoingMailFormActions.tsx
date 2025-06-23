
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";

interface OutgoingMailFormActionsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

const OutgoingMailFormActions: React.FC<OutgoingMailFormActionsProps> = ({
  onReset,
  isSubmitting = false,
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2 px-0 pb-0">
      <Button variant="outline" type="button" onClick={onReset} disabled={isSubmitting}>
        Réinitialiser
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </CardFooter>
  );
};

export default OutgoingMailFormActions;
