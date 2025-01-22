import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/components/categories/types";

export function useCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      console.error("Error creating category:", error);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: Category) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      console.error("Error updating category:", error);
    },
  });

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory,
  };
}