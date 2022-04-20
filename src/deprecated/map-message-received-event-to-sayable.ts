import {
  map,
  mergeMap,
}               from 'rxjs/operators'

import {
  actions,
}                           from '../duck/mod.js'
import type { Bus }         from '../bus.js'
import type * as events$    from '../mods/events$.js'

import { execute$ }   from '../execute$/mod.js'

/**
 * @deprecated use `execute$()` instead
 */
export const mapMessageReceivedEventToSayable = (bus$: Bus) => (source$: ReturnType<typeof events$.MESSAGE_RECEIVED_EVENT$>) => source$.pipe(
  map(messageReceivedEvent => actions.GET_SAYABLE_PAYLOAD_QUERY(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mergeMap(execute$(bus$)),
  map(message => message.payload),
)
