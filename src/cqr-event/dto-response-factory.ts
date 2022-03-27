import { getType } from 'typesafe-actions'

import type { CQType }  from '../classified/mod.js'

import type { PayloadMetaCreator }        from './payload-meta-creator.js'
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
  creator: PayloadMetaCreator<T>,
): TypeActionMap[RT]

export function dtoResponseFactory <
  T extends CQType,
  RT extends ResponseType<T>
> (type: T | PayloadMetaCreator<T>) {
  return (typeActionMap as any)[
    typeof type === 'string'
      ? responseType(type)
      : responseType(getType(type))
  ] as TypeActionMap[RT]
}
