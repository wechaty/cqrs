import {
  of,
  Observable,
}               from 'rxjs'
import {
  filter,
  map,
}               from 'rxjs/operators'
import {
  actions,
}                       from '../duck/mod.js'

import type { BusObs }  from '../cqrs.js'

import * as events      from '../events.js'

import { mapCommandQueryToMessage }   from './map-command-query-to-message.js'

export const mapToTalkerId$ = (messageReceivedEvent: ReturnType<typeof actions.messageReceivedEvent>) => (source$: Observable<any>) =>
  of(
    actions.getMessagePayloadQuery(
      messageReceivedEvent.meta.puppetId,
      messageReceivedEvent.payload.messageId,
    ),
  ).pipe(
    mapCommandQueryToMessage(source$)(
      actions.getMessagePayloadQuery,
      actions.messagePayloadGotMessage,
    ),
    map(message => message.payload?.fromId),
    filter(Boolean),
  )

export const mapMessageReceivedEventToSayable$ = () => (source$: BusObs) => events.messageReceivedEvent$(source$).pipe(
  map(messageReceivedEvent => actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mapCommandQueryToMessage(source$)(
    actions.getSayablePayloadQuery,
    actions.sayablePayloadGotMessage,
  ),
  map(message => message.payload),
  filter(Boolean),
)

export {
  mapCommandQueryToMessage,
}
