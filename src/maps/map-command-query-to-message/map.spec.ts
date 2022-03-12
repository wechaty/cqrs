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
}                         from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import * as CqrsDuck from '../../duck/mod.js'

import { mapCommandQueryToMessage } from './map.js'

test.only('map successful', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const command = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    contactId : CONTACT_ID,
    id        : command.meta.id,
    puppetId  : command.meta.puppetId,
  })

  const values = {
    c: command,
    m: message,
  }

  const source    = 'c      '
  const expected  = '---(m|)'

  const bus$ = new Subject<any>()

  const source$ = m.hot(source, values)

  const result$ = bus$.pipe(
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

  const command = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    gerror    : GERROR,
    id        : command.meta.id,
    puppetId  : command.meta.puppetId,
  })

  const values = {
    c: command,
    m: message,
  }

  const TIMEOUT_MILLISECONDS = 1000

  const source    = `c ${TIMEOUT_MILLISECONDS - 1}ms -`
  const expected  = `- ${TIMEOUT_MILLISECONDS - 1}ms (m|)`

  const bus$ = m.hot(source, values)

  const normalizeMessage = (message: ReturnType<typeof CqrsDuck.actions.currentUserIdGotMessage>) => ({
    ...message,
    meta: {
      ...message.meta,
      gerror: GError.from(message.meta.gerror).message,
    },
  })

  const result$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    mapCommandQueryToMessage(bus$, TIMEOUT_MILLISECONDS)(
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))
