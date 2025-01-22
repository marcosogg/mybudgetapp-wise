import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface ImportProgressProps {
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

export const ImportProgress = ({ totalRows, processedRows, isComplete }: ImportProgressProps) => {
  const progress = Math.round((processedRows / totalRows) * 100);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Import Complete
            </>
          ) : (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Transactions
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">
          {processedRows} of {totalRows} transactions processed
        </p>
      </CardContent>
    </Card>
  );
};