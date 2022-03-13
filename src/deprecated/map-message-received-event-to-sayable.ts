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
export const mapMessageReceivedEventToSayable = (bus$: Bus) => (source$: ReturnType<typeof events$.messageReceivedEvent$>) => source$.pipe(
  map(messageReceivedEvent => actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mergeMap(execute$(bus$)(actions.sayablePayloadGotMessage)),
  map(message => message.payload),
)
