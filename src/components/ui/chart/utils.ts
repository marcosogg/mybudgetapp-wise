import { ChartConfig } from "./types";

export const getPayloadConfigFromPayload = (
  config: ChartConfig,
  payload: any,
  key?: string
) => {
  if (!payload || !config) return null;
  const dataKey = key || payload.dataKey;
  return dataKey ? config[dataKey] : null;
};