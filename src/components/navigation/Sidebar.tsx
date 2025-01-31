import { Home, PieChart, List, Bell, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: List },
    { name: "Categories", href: "/categories", icon: PieChart },
    { name: "Budget", href: "/budget", icon: Wallet },
    { name: "Reminders", href: "/reminders", icon: Bell },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="h-full p-4 space-y-4 flex flex-col bg-background">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1877F2]">MyBudget</h1>
      </div>
      <nav className="space-y-1.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "nav-item w-full justify-start gap-2",
                isActive && "nav-item-active"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[#1877F2]")} />
              {item.name}
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <Button
          variant="ghost"
          className="nav-item w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};