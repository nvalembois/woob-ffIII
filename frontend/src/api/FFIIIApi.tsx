import { Config } from "../utils/configLoader"

export const createApiUrlWithParams = (config: Config, apiPath: string, params?: Record<string, string | number>) => {
    const url = new URL(`${config.apiUrl.replace(/\/+$/, "")}/${apiPath.replace(/^\/+/,"")}`);
    if (params)
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
    return url.toString();
};

export const ffiiApiDateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'short' });

