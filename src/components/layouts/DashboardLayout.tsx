import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main className={cn("flex-1 p-8", className)}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};