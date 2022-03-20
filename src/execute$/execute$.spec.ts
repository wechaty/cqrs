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
  Observable,
  of,
  Subject,
}                         from 'rxjs'
import {
  map,
  mergeMap,
}                         from 'rxjs/operators'

import {
  ResponseOf,
  responseOf,
}                     from '../cqr-event/response-pair.js'
import * as CqrsDuck  from '../duck/mod.js'

import { TIMEOUT_MS } from './constants.js'
import { execute$ }   from './execute$.js'
import { classify } from '../classify/classify.js'
import type { PayloadMetaAction } from 'typesafe-actions'
import type { MetaResponse } from '../cqr-event/meta.js'

test('execute$() message creator / in time', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  /**
   * Save to cache/register for future usage
   */
  const Response = classify(responseOf(CqrsDuck.actions.getCurrentUserIdQuery))

  const query = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const response = new Response({
    ...query.meta,
    contactId : CONTACT_ID,
  })

  const values = {
    q: query,
    r: response,
  }

  const source    = '-q--'
  const bus       = '---r'
  const expected  = '---r'

  const mockBus$ = m.hot(bus, values)
  const result$ = m.hot(source, { q: values.q }).pipe(
    mergeMap(execute$(mockBus$)),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('execute$() with message creator / timeout', testSchedulerRunner(m => {
  const PUPPET_ID = 'puppet-id'
  const GERROR    = 'Timeout has occurred'

  /**
   * Save to cache/register for future usage
   */
  const Response = classify(responseOf(CqrsDuck.actions.getCurrentUserIdQuery))

  const query     = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const response  = new Response({
    gerror    : GERROR,
    id        : query.meta.id,
    puppetId  : query.meta.puppetId,
  })

  const values = {
    q: query,
    r: response,
  }

  const source    = `q ${TIMEOUT_MS - 1}ms -`
  const expected  = `- ${TIMEOUT_MS - 1}ms r`

  const dummyBus$ = new Subject<any>()

  const normalizeMessage = (response: ReturnType<ResponseOf<typeof CqrsDuck.actions.getCurrentUserIdQuery>>) => ({
    ...response,
    meta: {
      ...response.meta,
      gerror: GError.from(response.meta.gerror).message,
    },
  })

  const result$ = m.hot(source, { q: values.q }).pipe(
    mergeMap(execute$(dummyBus$)),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('execute$() ReturnType typing', async t => {
  const bus$ = new Subject<any>()

  const query = CqrsDuck.actions.getCurrentUserIdQuery('PUPPET_ID')

  const $ = of(query).pipe(
    execute$(bus$),
  )

  const test: AssertEqual<
    ReturnType<typeof execute>,
    Observable<ReturnType<ResponseOf<typeof CqrsDuck.actions.getCurrentUserIdQuery>>>
  > = true

  t.ok(test, 'should get the right return type of message')
})

test('execute$() ReturnType typing without input', async t => {
  const bus$ = new Subject<any>()

  const execute = execute$(bus$)

  const test: AssertEqual<
    ReturnType<typeof execute>,
    Observable<PayloadMetaAction<string, {}, MetaResponse>>
  > = true

  t.ok(test, 'should get the right return type of response')
})
