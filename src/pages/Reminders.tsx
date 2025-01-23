import { useState } from "react";
import { useReminders } from "@/hooks/reminders/useReminders";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReminderDialog } from "@/components/reminders/ReminderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Reminders() {
  const [status, setStatus] = useState<"active" | "archived">("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: reminders, isLoading } = useReminders(status);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={(value) => setStatus(value as "active" | "archived")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading reminders...</p>
      ) : !reminders?.length ? (
        <p className="text-muted-foreground">No {status} reminders found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}

      <ReminderDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}