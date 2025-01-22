import { useLocation, useNavigate } from "react-router-dom";
import { Home, List, PieChart, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NavItem } from "./types";

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  { name: "Categories", href: "/categories", icon: PieChart },
  { name: "Reminders", href: "/reminders", icon: Bell },
];

export const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-8 text-2xl font-bold text-facebook">MyBudget</h2>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-facebook hover:bg-facebook-hover"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};