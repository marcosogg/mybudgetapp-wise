import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Reminder } from "@/types/reminder";
import { CalendarDays, RefreshCw } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{reminder.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Due: {format(new Date(reminder.due_date), "MMM d, yyyy")}</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            {reminder.recurrence}
          </Badge>
        </div>
        <div className="text-xl font-bold">
          ${reminder.amount.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}