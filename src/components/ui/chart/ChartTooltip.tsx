import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useChart } from "./ChartContext"
import { ChartTooltipContentProps } from "./types"
import { getPayloadConfigFromPayload } from "./utils"

export const ChartTooltip = RechartsPrimitive.Tooltip

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const itemConfig = getPayloadConfigFromPayload(config, item)
      const value = label || itemConfig?.label

      if (labelFormatter && value) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
    ])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const itemConfig = getPayloadConfigFromPayload(config, item)
            const indicatorColor = color || item.color

            return (
              <div
                key={item.dataKey || index}
                className="flex items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className={cn("h-2 w-2 rounded-full", {
                      "border border-dashed": indicator === "dashed",
                    })}
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <span className="text-muted-foreground">
                  {itemConfig?.label || item.name}
                </span>
                {formatter && item?.value !== undefined ? (
                  formatter(item.value)
                ) : (
                  <span className="font-mono font-medium tabular-nums">
                    {item.value?.toLocaleString()}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"