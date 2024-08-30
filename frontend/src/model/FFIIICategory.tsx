import { FIIIAmountSum, FFIIIMetaResult } from './FFIII'

export interface FIIICategoryAttributes {
  created_at:	string   // ($date-time)  example: 2018-09-17T12:46:47+01:00  readOnly: true
  updated_at:	string   // ($date-time)  example: 2018-09-17T12:46:47+01:00  readOnly: true
  name: string         // ($string)     example: Lunch
  notes?: string       // ($string)     example: Some example notes         nullable: true
  spent: FIIIAmountSum // readOnly: true
  earned: FIIIAmountSum // readOnly: true
}

export interface FFIIICatefory {
    type:	string // ($string) example: categories Immutable value
    id:	string   // ($string) example: 2
    attributes: FIIICategoryAttributes
}

export interface FFIICategoryResult {
  data: Array<FFIIICatefory>
  meta: FFIIIMetaResult
}

