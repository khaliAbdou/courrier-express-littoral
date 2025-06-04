
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface FormDatePickerProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  required?: boolean;
  className?: string;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  date,
  onDateChange,
  required = false,
  className = "",
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>Sélectionnez une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FormDatePicker;
