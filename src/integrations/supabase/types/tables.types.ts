import { Json } from './database.types';

export interface Tables {
  budgets: {
    Row: {
      amount: number;
      category_id: string;
      created_at: string | null;
      id: string;
      month: number;
      user_id: string;
      year: number;
    };
    Insert: {
      amount: number;
      category_id: string;
      created_at?: string | null;
      id?: string;
      month: number;
      user_id: string;
      year: number;
    };
    Update: {
      amount?: number;
      category_id?: string;
      created_at?: string | null;
      id?: string;
      month?: number;
      user_id?: string;
      year?: number;
    };
    Relationships: [
      {
        foreignKeyName: "budgets_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "categories";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "budgets_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
  categories: {
    Row: {
      created_at: string | null;
      id: string;
      name: string;
      user_id: string;
    };
    Insert: {
      created_at?: string | null;
      id?: string;
      name: string;
      user_id: string;
    };
    Update: {
      created_at?: string | null;
      id?: string;
      name?: string;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "categories_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
  mappings: {
    Row: {
      category_id: string;
      created_at: string | null;
      description_keyword: string;
      id: string;
      user_id: string;
    };
    Insert: {
      category_id: string;
      created_at?: string | null;
      description_keyword: string;
      id?: string;
      user_id: string;
    };
    Update: {
      category_id?: string;
      created_at?: string | null;
      description_keyword?: string;
      id?: string;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "mappings_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "categories";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "mappings_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
  profiles: {
    Row: {
      created_at: string;
      email: string;
      id: string;
      updated_at: string;
    };
    Insert: {
      created_at?: string;
      email: string;
      id: string;
      updated_at?: string;
    };
    Update: {
      created_at?: string;
      email?: string;
      id?: string;
      updated_at?: string;
    };
    Relationships: [];
  };
  reminders: {
    Row: {
      amount: number | null;
      created_at: string | null;
      due_date: string;
      id: string;
      name: string;
      recurrence: string;
      user_id: string;
    };
    Insert: {
      amount?: number | null;
      created_at?: string | null;
      due_date: string;
      id?: string;
      name: string;
      recurrence: string;
      user_id: string;
    };
    Update: {
      amount?: number | null;
      created_at?: string | null;
      due_date?: string;
      id?: string;
      name?: string;
      recurrence?: string;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "reminders_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
  transactions: {
    Row: {
      amount: number;
      category_id: string | null;
      created_at: string | null;
      date: string;
      description: string;
      id: string;
      tags: string[] | null;
      user_id: string;
    };
    Insert: {
      amount: number;
      category_id?: string | null;
      created_at?: string | null;
      date: string;
      description: string;
      id?: string;
      tags?: string[] | null;
      user_id: string;
    };
    Update: {
      amount?: number;
      category_id?: string | null;
      created_at?: string | null;
      date?: string;
      description?: string;
      id?: string;
      tags?: string[] | null;
      user_id?: string;
    };
    Relationships: [
      {
        foreignKeyName: "transactions_category_id_fkey";
        columns: ["category_id"];
        isOneToOne: false;
        referencedRelation: "categories";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "transactions_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      }
    ];
  };
}