import React, { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { getTagStyle } from "@/utils/tagUtils";

interface TagAutocompleteProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const TagAutocomplete = ({
  availableTags,
  selectedTags,
  onTagSelect,
}: TagAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTags = availableTags
    .filter((tag) => !selectedTags.includes(tag))
    .filter((tag) =>
      tag.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
              : "Select tags..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup>
            {filteredTags.map((tag) => {
              const style = getTagStyle(tag);
              const Icon = style.icon;
              return (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => {
                    onTagSelect(tag);
                    setOpen(false);
                  }}
                >
                  <Badge
                    variant="secondary"
                    className={cn(
                      "flex items-center gap-1 mr-2",
                      style.bg,
                      style.text
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {tag}
                  </Badge>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};