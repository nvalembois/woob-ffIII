export interface FFIIILinks {
  rel: string
  uri: string 
}

export interface FFIIIPagination {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
}

export interface FFIIIMetaResult {
  pagination?: FFIIIPagination
}

export interface FIIIAmountSum {
  currency_id: string             // ($string)  example: 5
  currency_code: string           // ($string)  example: USD
  currency_symbol: string         // ($string)  example: $
  currency_decimal_places: number // ($int32)   example: 2       Number of decimals supported by the currency
  sum: string                     // ($amount)  example: 123.45  The amount earned.
}
