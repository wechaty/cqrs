import { getType } from 'typesafe-actions'

import { ClassifiedConstructor, classify }     from '../classify/classify.js'

import type { Type }  from '../classified/mod.js'

import type { MetaActionCreator }         from './meta-action-creator.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

export function getObjectClass <T extends Type> (
  type: T,
): ClassifiedConstructor<TypeActionMap[T]>

export function getObjectClass <T extends Type> (
  creator: MetaActionCreator<T, any, any, any>,
): ClassifiedConstructor<TypeActionMap[T]>

export function getObjectClass <T extends Type> (
  type: T | MetaActionCreator<T, any, any, any>,
) {
  return typeof type === 'string'
    ? classify(typeActionMap[type])
    : classify(typeActionMap[getType(type)])
}
