import {
  map,
}               from 'rxjs/operators'

import type { Bus }   from '../bus.js'
import {
  actions,
}                     from '../duck/mod.js'

import type * as events$   from '../events$.js'

import {
  mapCommandQueryToMessage,
}                             from './map-command-query-to-message/mod.js'
export const mapToTalkerId = (bus$: Bus) => (source$: ReturnType<typeof events$.messageReceivedEvent$>) => source$.pipe(
  map(messageReceivedEvent => actions.getMessagePayloadQuery(messageReceivedEvent.meta.puppetId, messageReceivedEvent.payload.messageId)),
  mapCommandQueryToMessage(bus$)(actions.messagePayloadGotMessage),
  map(message => message.payload?.fromId),
)
