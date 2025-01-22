import { useState } from "react";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { CategoryStats } from "@/components/categories/CategoryStats";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { Category } from "@/components/categories/types";
import { useCategories } from "@/hooks/categories/useCategories";

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  
  const { categories, isLoading, createCategory, updateCategory } = useCategories();

  const handleSubmit = (name: string) => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, name });
    } else {
      createCategory.mutate(name);
    }
    handleCloseDialog();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Categories</h2>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <CategoryDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          editingCategory={editingCategory}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
        />
      </div>

      <CategoryStats categories={categories} />
      <CategoryTable categories={categories} onEdit={handleEdit} />
    </div>
  );
};

export default Categories;