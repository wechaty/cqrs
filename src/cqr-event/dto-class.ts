import { getType } from 'typesafe-actions'

import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type { Type }  from '../classified/mod.js'

import type { PayloadMetaCreator }        from './payload-meta-creator.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

export function dtoClass <T extends Type> (
  type: T,
): ClassifiedConstructor<TypeActionMap[T]>

export function dtoClass <T extends Type> (
  creator: PayloadMetaCreator<T>,
): ClassifiedConstructor<TypeActionMap[T]>

export function dtoClass <T extends Type> (
  type: T | PayloadMetaCreator<T>,
) {
  return typeof type === 'string'
    ? classify(typeActionMap[type])
    : classify(typeActionMap[getType(type)])
}
