import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { FileUpload } from "@/components/transactions/import/FileUpload";
import { CSVPreview } from "@/components/transactions/import/CSVPreview";
import { ImportProgress } from "@/components/transactions/import/ImportProgress";
import { useCSVImport } from "@/components/transactions/import/hooks/useCSVImport";

const TransactionImport = () => {
  const {
    file,
    previewData,
    error,
    isProcessing,
    totalRows,
    processedRows,
    isComplete,
    handleFileChange,
    processFile,
  } = useCSVImport();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Import Transactions</h2>
        <p className="text-muted-foreground">
          Import your transactions from a CSV file
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload
              onFileChange={handleFileChange}
              error={error}
              file={file}
            />

            {file && !error && (
              <CSVPreview
                headers={['Date', 'Description', 'Amount']}
                previewData={previewData}
                totalRows={totalRows}
                onProcess={processFile}
                isProcessing={isProcessing}
              />
            )}

            {isProcessing && (
              <ImportProgress
                totalRows={totalRows}
                processedRows={processedRows}
                isComplete={isComplete}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionImport;