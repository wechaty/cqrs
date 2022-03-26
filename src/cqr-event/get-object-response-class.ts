import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type { CQType }  from '../classified/mod.js'

import type { MetaActionCreator }   from './meta-action-creator.js'
import type { ResponseOf }          from './response-of.js'
import { getObjectResponseCreator } from './get-object-response-creator.js'

/**
 * Get Response Class by type (string)
 */
export function getObjectResponseClass <T extends CQType> (
  type: T,
): ClassifiedConstructor<ResponseOf<T>>

/**
 * Get Response Class by action creator (factory)
 */
export function getObjectResponseClass <T extends CQType> (
  creator: MetaActionCreator<T, any, any>,
): ClassifiedConstructor<ResponseOf<T>>

export function getObjectResponseClass <T extends CQType> (
  type: T | MetaActionCreator<T, any, any>,
): ClassifiedConstructor<ResponseOf<T>> {
  return typeof type === 'string'
    ? classify(getObjectResponseCreator(type))
    : classify(getObjectResponseCreator(type))
}
