import {
  type Observable,
  defer,
  of,
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

import { send$ }    from './send$.js'

type ExecuteOutput<P, AC extends (undefined | ((...args: any) => any))> = P extends unknown ? never
  : AC extends (...args: any) => any ? ReturnType<AC>
  : never

type Execute$ = (bus$: Bus) =>
  <
    MType extends string,
    MPayload extends any,
    R extends MetaResponse,
  >(
    messageActionCreator?: (res: R) => ActionBuilder<MType, MPayload, MetaResponse>
  ) => (
    commandQuery: ActionBuilder<any, any, MetaRequest>,
  ) => Observable<ExecuteOutput<MPayload, typeof messageActionCreator>>

export const execute$: Execute$ = bus$ => messageActionCreator => commandQuery => {
  if (typeof messageActionCreator === 'undefined') {
    return send$(bus$)(commandQuery)
  }

  return defer(() => of(commandQuery)).pipe(
    mapCommandQueryToMessage(bus$)(
      messageActionCreator,
    ),
  )
}
