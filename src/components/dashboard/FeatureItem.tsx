import { LucideIcon } from "lucide-react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-start space-x-4">
    <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);