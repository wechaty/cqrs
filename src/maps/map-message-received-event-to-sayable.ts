import {
  map,
}               from 'rxjs/operators'
import {
  actions,
}                       from '../duck/mod.js'

import type { Bus }  from '../cqrs.js'

import type * as events$      from '../events$.js'

import { mapCommandQueryToMessage }   from './map-command-query-to-message/mod.js'

export const mapMessageReceivedEventToSayable = (bus$: Bus) => (source$: ReturnType<typeof events$.messageReceivedEvent$>) => source$.pipe(
  map(messageReceivedEvent => actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mapCommandQueryToMessage(bus$)(
    actions.sayablePayloadGotMessage,
  ),
  map(message => message.payload),
)
