
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface EditOutgoingMailFormActionsProps {
  onClose: () => void;
  isSubmitting?: boolean;
}

const EditOutgoingMailFormActions: React.FC<EditOutgoingMailFormActionsProps> = ({
  onClose,
  isSubmitting = false,
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </DialogFooter>
  );
};

export default EditOutgoingMailFormActions;
