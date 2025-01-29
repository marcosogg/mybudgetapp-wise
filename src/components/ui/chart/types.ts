import { ReactNode } from "react"

export type ChartConfig = {
  [k in string]: {
    label?: ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
}

export type ChartContextProps = {
  config: ChartConfig
}

export type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<any>["children"]
}

export type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean
  payload?: any[]
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelFormatter?: (value: any, payload: any[]) => ReactNode
  labelClassName?: string
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => ReactNode
  color?: string
}