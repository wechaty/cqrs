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
  AssertEqual,
}                         from 'tstest'
import { GError }         from 'gerror'
import {
  EMPTY,
  Observable,
  Subject,
}                         from 'rxjs'
import {
  map,
  mergeMap,
}                         from 'rxjs/operators'

import * as CqrsDuck  from '../duck/mod.js'

import { TIMEOUT_MS } from './constants.js'
import { execute$ }   from './execute$.js'

test('execute$() message creator / in time', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const query = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    ...query.meta,
    contactId : CONTACT_ID,
  })

  const values = {
    m: message,
    q: query,
  }

  const source    = '-q--'
  const bus       = '---m'
  const expected  = '---m'

  const mockBus$ = m.hot(bus, values)
  const result$ = m.hot(source, { q: values.q }).pipe(
    mergeMap(execute$(mockBus$)(CqrsDuck.actions.currentUserIdGotMessage)),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('execute$() with message creator / timeout', testSchedulerRunner(m => {
  const PUPPET_ID = 'puppet-id'
  const GERROR    = 'Timeout has occurred'

  const query = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    gerror    : GERROR,
    id        : query.meta.id,
    puppetId  : query.meta.puppetId,
  })

  const values = {
    m: message,
    q: query,
  }

  const source    = `q ${TIMEOUT_MS - 1}ms -`
  const expected  = `- ${TIMEOUT_MS - 1}ms m`

  const dummyBus$ = new Subject<any>()

  const normalizeMessage = (message: ReturnType<typeof CqrsDuck.actions.currentUserIdGotMessage>) => ({
    ...message,
    meta: {
      ...message.meta,
      gerror: GError.from(message.meta.gerror).message,
    },
  })

  const result$ = m.hot(source, { q: values.q }).pipe(
    mergeMap(execute$(dummyBus$)(CqrsDuck.actions.currentUserIdGotMessage)),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('execute$() without message creator', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const query   = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    ...query.meta,
    contactId: CONTACT_ID,
  })

  const values = {
    m: message,
    q: query,
  }

  const source    = '-q-- 9m |'
  const bus       = '---m     '
  const expected  = '---- 9m |'

  const mockBus$ = m.hot(bus, values)
  const result$ = m.hot(source, { q: values.q }).pipe(
    mergeMap(execute$(mockBus$)()),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('execute$() ReturnType with message ', async t => {
  const bus$ = new Subject<any>()

  const execute = execute$(bus$)(CqrsDuck.actions.currentUserIdGotMessage)

  const test: AssertEqual<
    ReturnType<typeof execute>,
    Observable<ReturnType<typeof CqrsDuck.actions.currentUserIdGotMessage>>
  > = true

  t.ok(test, 'should get the right return type of message')
})

test('execute$() ReturnType without message ', async t => {
  const bus$ = new Subject<any>()

  const execute = execute$(bus$)()

  const test: AssertEqual<
    ReturnType<typeof execute>,
    typeof EMPTY
  > = true
  t.ok(test, 'should get the right return type of Observable<never>')
})
