import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  categoryName: string | null;
}

export const CategoryBadge = ({ categoryName }: CategoryBadgeProps) => {
  if (!categoryName) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Uncategorized
      </Badge>
    );
  }

  return <Badge>{categoryName}</Badge>;
};