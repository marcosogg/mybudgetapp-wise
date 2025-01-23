export interface Reminder {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  recurrence: string;
  status: 'active' | 'archived';
  created_at?: string;
}

export interface ReminderFormValues {
  name: string;
  amount: number;
  due_date: string;
  recurrence: string;
}