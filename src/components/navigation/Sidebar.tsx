import { Home, PieChart, List, Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: List },
    { name: "Categories", href: "/categories", icon: PieChart },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Mappings", href: "/mappings", icon: MapPin },
  ];

  return (
    <div className="h-full bg-budget-gray p-4 space-y-4">
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
    </div>
  );
};