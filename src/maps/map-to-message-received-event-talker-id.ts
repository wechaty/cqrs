import {
  of,
  Observable,
}               from 'rxjs'
import {
  filter,
  map,
  mergeMap,
}               from 'rxjs/operators'

import type { Bus }   from '../cqrs.js'
import {
  actions,
}                     from '../duck/mod.js'

import {
  mapToCommandQueryMessage,
}                             from './map-to-command-query-message.js'

export const mapToTalkerId$ = (bus$: Bus) => (messageReceivedEvent: ReturnType<typeof actions.messageReceivedEvent>) => (source$: Observable<any>) =>
  of(
    actions.getMessagePayloadQuery(
      messageReceivedEvent.meta.puppetId,
      messageReceivedEvent.payload.messageId,
    ),
  ).pipe(
    mergeMap(query => mapToCommandQueryMessage(bus$)(
      query,
      actions.messagePayloadGotMessage,
    ),
    map(message => message.payload?.fromId),
    filter(Boolean),
  )
