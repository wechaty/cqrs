import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type { CQType }  from '../classified/mod.js'

import type { MetaActionCreator }   from './meta-action-creator.js'
import type { ResponseOf }          from './response-of.js'
import { getObjectResponseCreator } from './dto-responsefactory.js'

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
  creator: MetaActionCreator<T, any, any>,
): ClassifiedConstructor<ResponseOf<T>>

export function dtoResponseClass <T extends CQType> (
  type: T | MetaActionCreator<T, any, any>,
): ClassifiedConstructor<ResponseOf<T>> {
  return typeof type === 'string'
    ? classify(getObjectResponseCreator(type))
    : classify(getObjectResponseCreator(type))
}
