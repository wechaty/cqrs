import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type * as dto   from '../dto/mod.js'

import type { PayloadMetaActionFactory }  from './payload-meta-action-factory.js'
import type { ResponseOf }                from './response-of.js'
import { dtoResponseFactory }             from './dto-response-factory.js'

/**
 * Get Response Class by type (string)
 */
export function dtoResponseClass <T extends dto.types.CommandQuery> (
  type: T,
): ClassifiedConstructor<ResponseOf<T>>

/**
 * Get Response Class by action creator (factory)
 */
export function dtoResponseClass <T extends dto.types.CommandQuery> (
  creator: PayloadMetaActionFactory<T>
): ClassifiedConstructor<ResponseOf<T>>

export function dtoResponseClass <T extends dto.types.CommandQuery> (
  type: T | PayloadMetaActionFactory<T>,
): ClassifiedConstructor<ResponseOf<T>> {
  return typeof type === 'string'
    ? classify(dtoResponseFactory(type))
    : classify(dtoResponseFactory(type))
}
