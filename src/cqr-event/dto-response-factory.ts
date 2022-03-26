import { getType } from 'typesafe-actions'

import type { CQType }  from '../classified/mod.js'

import type { MetaActionCreator }         from './meta-action-creator.js'
import { ResponseType, responseType }     from './response-type.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

export function dtoResponseFactory <
  T extends CQType,
  RT extends ResponseType<T>
> (
  type: T,
):  TypeActionMap[RT]

export function dtoResponseFactory <
  T extends CQType,
  RT extends ResponseType<T>
> (
  creator: MetaActionCreator<T, any, any, any>,
): TypeActionMap[RT]

export function dtoResponseFactory <
  T extends CQType,
  RT extends ResponseType<T>
> (type: T | MetaActionCreator<T, any, any, any>) {
  return (typeActionMap as any)[
    typeof type === 'string'
      ? responseType(type)
      : responseType(getType(type))
  ] as TypeActionMap[RT]
}
