import { useState, useEffect } from "react"
import { Config } from "../utils/configLoader"
import { FFIIITransactionResult } from '../model/FFIIITransaction'
import { createApiUrlWithParams } from './FFIIIApi'

export interface FFIIITransactionsQueryParams {
  xTraceId?: string  //                                        Unique identifier associated with this request.
  limit?: number     // (int32)  default: 50  constraints: >0  Number of items per page.
  page?: number      // (int32)  default: 1   constraints: >0  Page number.
  start?: Date       // ()                                     A date to limit the result list.
  end?: Date         // ()                                     A date to limit the result list.
  type?: string      //                                        Optional filter on the transaction type(s) returned
  category?: string  //                                        Optional filter on the transaction category
}

const dtFmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeZone: 'Europe/Paris'});
const paramsToRecord = (params: FFIIITransactionsQueryParams) => {
  const response : Record<string, string | number> = {};
  if (params.xTraceId) response["X-Trace-Id"] = params.xTraceId;
  if (params.limit)    response["limit"]      = Math.min(5,Math.floor(params.limit));
  if (params.page)     response["page"]       = Math.min(1,Math.floor(params.page));
  if (params.start)    response["start"]      = dtFmt.format(params.start);
  if (params.end)      response["end"]        = dtFmt.format(params.end);
  if (params.xTraceId) response["X-Trace-Id"] = params.xTraceId;
  if (params.xTraceId) response["X-Trace-Id"] = params.xTraceId;
  return response;
}

export const useTransactionsLoader = (config: Config | null, access_token: string, params: FFIIITransactionsQueryParams) => {
  const [data, setData] = useState<FFIIITransactionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Attendre que la configuration soit chargée avant de démarrer le chargement des données
    if (!config) return;
    // Ne pas lancer un nouveau chargement si un chargement est en cours
    if (loading) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const url: string = ((p: FFIIITransactionsQueryParams) => {
          switch(p) {
            case p.category: 
              return `${config.apiUrl}/v1/categories/${p.category}/transactions`;
            default: 
              return `${config.apiUrl}/v1/transactions`;
          }
        })(params);
        const response = await fetch(
          createApiUrlWithParams(config, url, paramsToRecord(params)),
          { headers: {Authorization: `Bearer ${access_token}`}}
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: FFIIITransactionResult = await response.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [config]);

  return { data, loading, error };
};

