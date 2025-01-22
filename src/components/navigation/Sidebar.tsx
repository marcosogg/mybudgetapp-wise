import { Home, PieChart, List, Bell, LogOut } from "lucide-react";
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
    <div className="h-full bg-budget-gray p-4 space-y-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-facebook">MyBudget</h1>
      </div>
      <nav className="space-y-2">
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
      <div className="mt-auto pt-4">
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