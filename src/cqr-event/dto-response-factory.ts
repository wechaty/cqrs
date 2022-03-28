import { getType } from 'typesafe-actions'

import type * as dto   from '../dto/mod.js'

import type { PayloadMetaActionFactory }  from './payload-meta-action-factory.js'
import { ResponseType, responseType }     from './response-type.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

export function dtoResponseFactory <
  T extends dto.types.CommandQuery,
  RT extends ResponseType<T>
> (
  type: T,
):  TypeActionMap[RT]

export function dtoResponseFactory <
  T extends dto.types.CommandQuery,
  RT extends ResponseType<T>
> (
  creator: PayloadMetaActionFactory<T>,
): TypeActionMap[RT]

export function dtoResponseFactory <
  T extends dto.types.CommandQuery,
  RT extends ResponseType<T>
> (type: T | PayloadMetaActionFactory<T>) {
  return (typeActionMap as any)[
    typeof type === 'string'
      ? responseType(type)
      : responseType(getType(type))
  ] as TypeActionMap[RT]
}
