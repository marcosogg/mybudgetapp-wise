import { TooltipProps } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    theme?: Record<"light" | "dark", string>;
  };
}

export interface ChartContextProps {
  config: ChartConfig;
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  config: ChartConfig;
  children: React.ReactElement;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any) => string;
  indicator?: "solid" | "dashed";
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  labelClassName?: string;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export interface ChartLegendContentProps {
  payload?: Array<{
    value: string;
    type: string;
    id: string;
    color: string;
    dataKey?: string;
  }>;
}