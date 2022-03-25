import { classify }   from '../classify/classify.js'
import type * as duck from '../duck/mod.js'

import {
  ResponseType,
  responseType,
}                     from './response-type.js'

import { TypeActionMap, typeActionMap } from './type-action-map.js'

export const getCreatorByType = <T extends duck.Type> (type: T) => typeActionMap[type]
export const getClassByType   = <T extends duck.Type> (type: T) => classify(typeActionMap[type])

export const getResponseCreatorByType = <
  T extends duck.Type,
  RT extends ResponseType<T>
> (type: T) => (typeActionMap as any)[
  responseType(type)
] as TypeActionMap[RT extends duck.Type ? RT : never]

export const getResponseClassByType = <T extends duck.Type> (type: T) => classify(getResponseCreatorByType(type))
