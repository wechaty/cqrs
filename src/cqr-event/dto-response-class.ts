import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type { CQType }  from '../classified/mod.js'

import type { PayloadMetaCreator }  from './payload-meta-creator.js'
import type { ResponseOf }          from './response-of.js'
import { dtoResponseFactory } from './dto-response-factory.js'

/**
 * Get Response Class by type (string)
 */
export function dtoResponseClass <T extends CQType> (
  type: T,
): ClassifiedConstructor<ResponseOf<T>>

/**
 * Get Response Class by action creator (factory)
 */
export function dtoResponseClass <T extends CQType> (
  creator: PayloadMetaCreator
): ClassifiedConstructor<ResponseOf<T>>

export function dtoResponseClass <T extends CQType> (
  type: T | PayloadMetaCreator<T>,
): ClassifiedConstructor<ResponseOf<T>> {
  return typeof type === 'string'
    ? classify(dtoResponseFactory(type))
    : classify(dtoResponseFactory(type))
}
