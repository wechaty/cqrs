import {
  filter,
  map,
}               from 'rxjs/operators'
import {
  actions,
}                       from '../duck/mod.js'

import type { BusObs }  from '../cqrs.js'

import * as events      from '../events.js'

import { mapToCommandQueryMessage }   from './map-to-command-query-message.js'

export const mapMessageReceivedEventToSayable$ = () => (source$: BusObs) => events.messageReceivedEvent$(source$).pipe(
  map(messageReceivedEvent => actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mapToCommandQueryMessage(source$)(
    actions.getSayablePayloadQuery,
    actions.sayablePayloadGotMessage,
  ),
  map(message => message.payload),
  filter(Boolean),
)
