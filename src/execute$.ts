import {
  defer,
  of,
  EMPTY,
}                   from 'rxjs'
import type {
  ActionBuilder,
}                   from 'typesafe-actions'

import type { Bus } from './cqrs.js'

import type {
  MetaRequest,
  MetaResponse,
}                                   from './duck/actions/meta.js'

import { mapToCommandQueryMessage } from './maps/mod.js'

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
      mapToCommandQueryMessage(bus$)(
        commandQuery,
        messageBuilder,
      ),
    )
  }
