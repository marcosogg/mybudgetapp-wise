import { ChartConfig } from "./types"

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  // Create dynamic classes based on chart colors
  const chartClasses = colorConfig
    .map(([key, itemConfig], index) => {
      const colorClass = `chart-color-${index + 1}`
      const bgClass = `chart-bg-${index + 1}`
      return `[data-chart="${id}"] .chart-item-${key} { @apply ${colorClass} ${bgClass}; }`
    })
    .join("\n")

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: chartClasses
      }}
    />
  )
}