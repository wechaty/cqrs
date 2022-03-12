import {
  filter,
  map,
}               from 'rxjs/operators'
import {
  actions,
}                       from '../duck/mod.js'

import type { BusObs }  from '../cqrs.js'

import * as events      from '../events.js'

import { mapCommandQueryToMessage }   from './map-command-query-to-message/mod.js'

export const mapMessageReceivedEventToSayable = () => (source$: ReturnType<typeof events.messageReceivedEvent$>) => source$.pipe(
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
