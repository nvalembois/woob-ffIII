import { FFIIILinks, FFIIIMetaResult } from './FFIII'

export interface FFIIITransactionItem {
  user: string // number
  transaction_journal_id: string // number
  type: string // withdrawal|
  date: string // Date
  order: number
  currency_id: string //number
  currency_code: string
  currency_symbol: string //number
  currency_name: string //number
  currency_decimal_places: number
  foreign_currency_id: string //number
  foreign_currency_code: string
  foreign_currency_symbol: string
  foreign_currency_decimal_places: number
  amount: string // number
  foreign_amount: string // number
  description: string
  source_id: string //number
  source_name: string
  source_iban: string
  source_type: string
  destination_id: string //number
  destination_name: string
  destination_iban: string
  destination_type: string
  budget_id: string //number
  budget_name: string
  category_id: string //number
  category_name: string
  bill_id: string //number
  bill_name: string
  reconciled: boolean
  notes: string
  tags: null,
  internal_reference: string
  external_id: string
  external_url: string
  original_source: string
  recurrence_id: string
  recurrence_total: number
  recurrence_count: number
  bunq_payment_id: string
  import_hash_v2: string
  sepa_cc: string
  sepa_ct_op: string
  sepa_ct_id: string
  sepa_db: string
  sepa_country: string
  sepa_ep: string
  sepa_ci: string
  sepa_batch_id: string
  interest_date: string // Date
  book_date: string // Date
  process_date: string // Date
  due_date: string // Date
  payment_date: string // Date
  invoice_date: string // Date
  latitude: number
  longitude: number
  zoom_level: number
  has_attachments: boolean
}

export interface FFIIITransactionAttributes {
  created_at?: string // Date
  updated_at?: Date // Date
  user?: string // number
  group_title?: string
  transactions: FFIIITransactionItem[]
}

export interface FFIIITransaction {
  type: string
  id: string
  attributes: FFIIITransactionAttributes
  links: Map<string, FFIIILinks|string>
}

export interface FFIIITransactionResult {
  data: Array<FFIIITransaction>
  meta: FFIIIMetaResult
  links: Map<string, FFIIILinks|string>
}
