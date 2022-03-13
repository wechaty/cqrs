import {
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
}                                   from './duck/actions/meta.js'
import { mapCommandQueryToMessage } from './maps/mod.js'

import type { Bus } from './bus.js'

export const execute$ = (bus$: Bus) =>
  <
    MType extends string,
    MPayload extends any,
    R extends MetaResponse,
  >(
    commandQuery    : ActionBuilder<any, any, MetaRequest>,
    messageBuilder? : (res: R) => ActionBuilder<MType, MPayload,  MetaResponse>,
  ) => {
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
