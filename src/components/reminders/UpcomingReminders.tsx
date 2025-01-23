import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReminders } from "@/hooks/reminders/useReminders";
import { ReminderCard } from "./ReminderCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpcomingReminders() {
  const { data: reminders, isLoading } = useReminders();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Reminders</CardTitle>
        </div>
        <Button size="sm" onClick={() => navigate("/reminders")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reminders...</p>
        ) : !reminders?.length ? (
          <p className="text-sm text-muted-foreground">No upcoming reminders</p>
        ) : (
          reminders.slice(0, 3).map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        )}
      </CardContent>
    </Card>
  );
}