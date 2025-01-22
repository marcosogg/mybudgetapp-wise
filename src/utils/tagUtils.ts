export const normalizeTags = (input: string): string[] => {
  return input
    .split(',')
    .map(tag => 
      tag
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Whitelist valid chars
        .replace(/[_ ]+/g, '-')     // Convert spaces/underscores to hyphens
        .replace(/-+/g, '-')        // Collapse consecutive hyphens
    )
    .filter(tag => tag.length >= 2 && tag.length <= 25)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
};