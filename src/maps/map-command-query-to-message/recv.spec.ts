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
  map,
  filter,
}                         from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import * as CqrsDuck from '../../duck/mod.js'

import { recv } from './recv.js'

test('recv() in time', testSchedulerRunner(m => {
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

  const TIMEOUT_MS = 100
  const source    = `${TIMEOUT_MS - 1}ms m`
  const expected  = `${TIMEOUT_MS - 1}ms (m|)`

  const bus$ = m.hot(source, values)

  const result$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.currentUserIdGotMessage)),
    recv(TIMEOUT_MS)(
      command,
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('recv() timeout', testSchedulerRunner(m => {
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

  const TIMEOUT_MS = 100

  const source    = `${TIMEOUT_MS}ms -`
  const expected  = `${TIMEOUT_MS}ms (m|)`

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
    recv(TIMEOUT_MS)(
      command,
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))