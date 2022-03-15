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
import { GError }         from 'gerror'
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

import { mapCommandQueryToMessage } from './map.js'

test('map successful (in time)', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const query   = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    ...query.meta,
    contactId : CONTACT_ID,
  })

  const values = {
    m: message,
    q: query,
  }

  const DELAY_MS = 10

  const source    = 'q              '
  const expected  = `${DELAY_MS}ms m`

  const bus$ = new Subject<any>()

  /**
   * Service Mock: Query -> Message
   */
  const mockService$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    delay(DELAY_MS),
    map(() => message),
  )
  mockService$.subscribe(bus$)

  const source$ = m.hot(source, values)

  const result$ = source$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('map timeout', testSchedulerRunner(m => {
  const PUPPET_ID = 'puppet-id'
  const GERROR    = 'Timeout has occurred'

  const query = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    ...query.meta,
    gerror: GERROR,
  })

  const values = {
    m: message,
    q: query,
  }

  const TIMEOUT_MILLISECONDS = 100

  const source    = `q ${TIMEOUT_MILLISECONDS - 1}ms  `
  const expected  = `- ${TIMEOUT_MILLISECONDS - 1}ms m`

  const bus$ = new Subject<any>()

  /**
   * Service Mock: Query -> Message
   */
  const mockService$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    delay(TIMEOUT_MILLISECONDS),
    map(() => message),
  )
  mockService$.subscribe(bus$)

  const source$ = m.hot(source, values)

  const normalizeMessage = (message: ReturnType<typeof CqrsDuck.actions.currentUserIdGotMessage>) => ({
    ...message,
    meta: {
      ...message.meta,
      gerror: GError.from(message.meta.gerror).message,
    },
  })

  const result$ = source$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    mapCommandQueryToMessage(bus$, TIMEOUT_MILLISECONDS)(
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))
