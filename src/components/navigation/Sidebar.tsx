import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Upload,
  BarChart3,
} from "lucide-react";

const links = [
  {
    to: "/transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    to: "/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    to: "/import",
    label: "Import",
    icon: Upload,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

const Sidebar = () => {
  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5"
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;