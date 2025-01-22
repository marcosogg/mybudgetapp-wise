import { Upload } from "lucide-react";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  file: File | null;
}

export const FileUpload = ({ onFileChange, error, file }: FileUploadProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to select</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              CSV files only
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && !error && (
        <div className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </div>
      )}
    </div>
  );
};