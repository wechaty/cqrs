import { getType } from 'typesafe-actions'

import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type * as dto  from '../dto/mod.js'

import type { PayloadMetaActionFactory }  from './payload-meta-action-factory.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

export function dtoClass <T extends dto.types.Type> (
  type: T,
): ClassifiedConstructor<TypeActionMap[T]>

export function dtoClass <T extends dto.types.Type> (
  creator: PayloadMetaActionFactory<T>,
): ClassifiedConstructor<TypeActionMap[T]>

export function dtoClass <T extends dto.types.Type> (
  type: T | PayloadMetaActionFactory<T>,
) {
  return typeof type === 'string'
    ? classify(typeActionMap[type])
    : classify(typeActionMap[getType(type)])
}
