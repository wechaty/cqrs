#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  test,
  testSchedulerRunner,
}                         from 'tstest'
import {
  Subject,
}                         from 'rxjs'
import {
  map,
  filter,
  delay,
}                         from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import * as CqrsDuck from '../duck/mod.js'

import {
  mapToTalkerId,
}                     from './map-to-message-received-event-talker-id.js'

test('mapToTalkerId()', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const MESSAGE_ID  = 'message-id'
  const TALKER_ID   = 'talker-id'

  const messageReceivedEvent = CqrsDuck.actions.MESSAGE_RECEIVED_EVENT(PUPPET_ID, { messageId: MESSAGE_ID })

  const values = {
    e: messageReceivedEvent,
    t: TALKER_ID,
  }

  const source    = 'e'
  const expected  = 't'

  const bus$ = new Subject<any>()

  /**
   * Service Mock: Query -> Message
   */
  const mockService$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.GET_MESSAGE_PAYLOAD_QUERY)),
    /**
     * Huan(202203): important: let the bullet to fly awhile
     *  if no `delay(0)` (next event loop), the event will be fired too fast
     *  before other `pipe`s has been setting up completed,
     *  which will caused event lost.
     */
    delay(0),
    map(query => CqrsDuck.actions.GET_MESSAGE_PAYLOAD_QUERY_RESPONSE({
      ...query.meta,
      message: {
        talkerId: TALKER_ID,
      } as any,
    })),
  )

  mockService$.subscribe(bus$)

  const source$ = m.hot(source, {
    e: values.e,
  })

  const result$ = source$.pipe(
    filter(isActionOf(CqrsDuck.actions.MESSAGE_RECEIVED_EVENT)),
    mapToTalkerId(bus$),
  )

  m.expectObservable(result$).toBe(expected, values)
}))
