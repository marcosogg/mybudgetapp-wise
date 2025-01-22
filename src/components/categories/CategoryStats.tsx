import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "./types";

interface CategoryStatsProps {
  categories: Category[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{categories.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}