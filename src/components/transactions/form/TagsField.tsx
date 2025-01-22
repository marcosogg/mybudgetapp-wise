import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "../TransactionForm";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeTags, getTagStyle } from "@/utils/tagUtils";
import { TagAutocomplete } from "./TagAutocomplete";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TagsFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export const TagsField = ({ form }: TagsFieldProps) => {
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .select("tags")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const availableTags = Array.from(
    new Set(
      transactions
        .flatMap((t) => t.tags || [])
        .filter(Boolean)
    )
  ).sort();

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value) {
        const currentTags = form.getValues('tags');
        const normalizedTag = normalizeTags(value)[0];
        
        if (normalizedTag && !currentTags.includes(normalizedTag)) {
          form.setValue('tags', [...currentTags, normalizedTag]);
        }
        
        input.value = '';
      }
    }
  };

  const handleTagSelect = (tag: string) => {
    const currentTags = form.getValues('tags');
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {field.value.map((tag) => {
                const style = getTagStyle(tag);
                const Icon = style.icon;
                return (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={`flex items-center gap-1 ${style.bg} ${style.text}`}
                  >
                    <Icon className="h-3 w-3" />
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <div className="space-y-2">
              <TagAutocomplete
                availableTags={availableTags}
                selectedTags={field.value}
                onTagSelect={handleTagSelect}
              />
              <FormControl>
                <Input
                  placeholder="Or type a new tag and press Enter"
                  onKeyDown={handleTagInput}
                />
              </FormControl>
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};