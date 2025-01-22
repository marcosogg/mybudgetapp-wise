import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}