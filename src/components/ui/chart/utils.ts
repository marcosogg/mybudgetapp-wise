export const getPayloadConfigFromPayload = (payload: any, config: any) => {
  if (!payload || !config) return null;
  const key = Object.keys(config).find((key) => payload.dataKey === key);
  return key ? config[key] : null;
};