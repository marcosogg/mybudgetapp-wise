import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMonth } from "@/contexts/MonthContext";
import { cn } from "@/lib/utils";

export function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useMonth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedMonth, "MMMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedMonth}
          onSelect={(date) => date && setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}