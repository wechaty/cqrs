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
export const mapToTalkerId = (bus$: Bus) => (source$: ReturnType<typeof events$.MESSAGE_RECEIVED_EVENT$>) => source$.pipe(
  map(messageReceivedEvent => actions.GET_MESSAGE_PAYLOAD_QUERY(messageReceivedEvent.meta.puppetId, messageReceivedEvent.payload.messageId)),
  mergeMap(execute$(bus$)),
  /**
   * Huan(202203): `.fromId` deprecated, will be removed after v2.0
   */
  map(message => message.payload.message?.talkerId || message.payload.message?.fromId),
)
