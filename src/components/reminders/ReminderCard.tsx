import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Reminder } from "@/types/reminder";
import { Archive, CalendarDays, MoreVertical, RefreshCw, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useReminderActions } from "@/hooks/reminders/useReminderActions";

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const { archiveReminder, deleteReminder } = useReminderActions();

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-semibold">{reminder.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {reminder.status === "active" && (
              <DropdownMenuItem onClick={() => archiveReminder(reminder.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteReminder(reminder.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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