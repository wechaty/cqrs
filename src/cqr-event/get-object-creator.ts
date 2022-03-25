import { getType } from 'typesafe-actions'
import { classify }   from '../classify/classify.js'
import type { MetaActionCreator } from './meta-action-creator.js'
import type * as duck from '../duck/mod.js'

import {
  ResponseType,
  responseType,
}                     from './response-type.js'

import { TypeActionMap, typeActionMap } from './type-action-map.js'

export const getCreator = <T extends duck.Type> (type: T) => typeActionMap[type]
export const getClass   = <T extends duck.Type> (
  type: T | MetaActionCreator<T, any, any>,
) => typeof type === 'string'
    ? classify(typeActionMap[type])
    : classify(typeActionMap[getType(type)])

export const getResponseCreator = <
  T extends duck.Type,
  RT extends ResponseType<T>
> (type: T | MetaActionCreator<T, any, any>) => (typeActionMap as any)[
  typeof type === 'string'
    ? responseType(type)
    : responseType(getType(type))
] as TypeActionMap[RT extends duck.Type ? RT : never]

export const getResponseClass = <T extends duck.Type> (
  type: T | MetaActionCreator<T, any, any>,
) => classify(getResponseCreator(type))
