import { Config } from "../utils/configLoader"

export const createApiUrlWithParams = (config: Config, apiPath: string, params: Record<string, string | number>) => {
    const url = new URL(`${config.apiUrl}/${apiPath}`);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
    return url.toString();
};
  