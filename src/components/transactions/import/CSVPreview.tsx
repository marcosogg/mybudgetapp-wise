import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVPreviewProps {
  headers: string[];
  previewData: Array<{ [key: string]: string }>;
  onProcess: () => void;
  isProcessing: boolean;
}

export const CSVPreview = ({ headers, previewData, onProcess, isProcessing }: CSVPreviewProps) => {
  if (!previewData.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview (First 5 rows)</h3>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {row[header.toLowerCase()]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onProcess} 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process Import"}
        </Button>
      </div>
    </div>
  );
};