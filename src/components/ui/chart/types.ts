import { TooltipProps } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface ChartContextProps {
  config: ChartConfig;
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  config: ChartConfig;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any) => string;
  indicator?: "solid" | "dashed";
}

export interface ChartLegendContentProps {
  payload?: Array<{
    value: string;
    type: string;
    id: string;
    color: string;
  }>;
}