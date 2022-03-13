import {
  type Observable,
  defer,
  of,
  EMPTY,
}                   from 'rxjs'
import type {
  ActionBuilder,
}                   from 'typesafe-actions'

import type {
  MetaRequest,
  MetaResponse,
}                                   from '../duck/actions/meta.js'

import { mapCommandQueryToMessage } from './map.js'

import type { Bus } from '../bus.js'

type Execute$ = (bus$: Bus) =>
  <
    MType extends string,
    MPayload extends any,
    R extends MetaResponse,
  >(
    messageBuilder? : (res: R) => ActionBuilder<MType, MPayload,  MetaResponse>,
  ) => (
    commandQuery: ActionBuilder<any, any, MetaRequest>,
  ) => Observable<ActionBuilder<MType, MPayload,  MetaResponse>>

export const execute$: Execute$ = bus$ => messageBuilder => commandQuery => {
  if (!messageBuilder) {
    bus$.next(commandQuery)
    return EMPTY
  }

  return defer(() => of(commandQuery)).pipe(
    mapCommandQueryToMessage(bus$)(
      messageBuilder,
    ),
  )
}
