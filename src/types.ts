import ref from 'ref'

/**
 * ffi.Library types
 */
export type FfiType = 'void'
                    | 'bool'
                    | 'int' | 'int64' | 'uint64'
                    | 'string'
                    | 'pointer'
                    | ref.Type

/**
 * Metadata design:returntype
 */
export type DesignType =  typeof undefined
                        | typeof Boolean
                        | typeof Buffer
                        | typeof Number
                        | typeof Promise
                        | typeof String

export type FfiLibraryFuncConfig = [ FfiType, FfiType[] ]

export interface FfiLibraryConfig {
  [key: string]: FfiLibraryFuncConfig,
}

const designTypeMap = new Map<DesignType, FfiType[]>()
  .set(undefined, ['void'])
  .set(String, ['string'])
  .set(Number, [
    'int',
    'int64',
    'uint64',
  ])
  .set(Buffer, ['pointer'])
  .set(Boolean, ['bool'])

export function toFfiType (
  designType: DesignType,
): FfiType[] {
  if (!designTypeMap.has(designType)) {
    throw new Error(`Unsupported designType: ${typeof designType} ${designType && designType.name} ${designType}`)
  }

  const ffiType = designTypeMap.get(designType)
  if (!ffiType) {
    throw new Error('ffiType can not be undefined!')
  }

  return ffiType
}

export function isStatic (target: any): boolean {
  if (typeof target === 'function' && target.name) {
    return true
  } else if (typeof target === 'object' && !target.name) {
    return false
  }

  throw new Error('FIXME: Unknown state for target.')
}
