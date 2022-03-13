import {
  map,
  mergeMap,
}               from 'rxjs/operators'

import type { Bus }   from '../bus.js'
import {
  actions,
}                     from '../duck/mod.js'

import type * as events$   from '../mods/events$.js'

import {
  execute$,
}                             from '../execute$/mod.js'

/**
 * @deprecated use `execute$()` instead
 */
export const mapToTalkerId = (bus$: Bus) => (source$: ReturnType<typeof events$.messageReceivedEvent$>) => source$.pipe(
  map(messageReceivedEvent => actions.getMessagePayloadQuery(messageReceivedEvent.meta.puppetId, messageReceivedEvent.payload.messageId)),
  mergeMap(execute$(bus$)(actions.messagePayloadGotMessage)),
  map(message => message.payload?.fromId),
)
