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
  AssertEqual,
  test,
  testSchedulerRunner,
}                         from 'tstest'
import { GError }         from 'gerror'
import type { Observable } from 'rxjs'
import {
  map,
  filter,
}                         from 'rxjs/operators'
import { isActionOf }     from 'typesafe-actions'

import * as CqrsDuck            from '../duck/mod.js'
import { dtoResponseClass }     from '../cqr-event/dto-response-class.js'
import { dtoResponseFactory }   from '../cqr-event/dto-response-factory.js'
import * as dto                 from '../dto/mod.js'
import type { BusObs }          from '../bus.js'

import { recv }     from './recv.js'

test('recv() in time', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const query     = CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY(PUPPET_ID)
  const response  = dtoResponseFactory(CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY)({
    ...query.meta,
    contactId : CONTACT_ID,
  })

  const values = {
    q: query,
    r: response,
  }

  const TIMEOUT_MS = 100
  const source    = `${TIMEOUT_MS - 1}ms r`
  const expected  = `${TIMEOUT_MS - 1}ms (r|)`

  const bus$ = m.hot(source, values)

  const Response = dtoResponseClass(CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY)

  const result$ = bus$.pipe(
    recv(TIMEOUT_MS)(
      query,
      Response,
    ),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('recv() timeout', testSchedulerRunner(m => {
  const PUPPET_ID = 'puppet-id'
  const GERROR    = 'Timeout has occurred'

  const Response = dtoResponseClass(CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY)

  const query     = CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY(PUPPET_ID)
  const response  = new Response({
    ...query.meta,
    gerror: GERROR,
  })

  const values = {
    q: query,
    r: response,
  }

  const TIMEOUT_MS = 100

  const source    = `${TIMEOUT_MS}ms -`
  const expected  = `${TIMEOUT_MS}ms (r|)`

  const bus$ = m.hot(source, values)

  const normalizeMessage = (message: InstanceType<typeof dto.actions.responses.GetCurrentUserIdQueryResponse>) => ({
    ...message,
    meta: {
      ...message.meta,
      gerror: GError.from(message.meta.gerror).message,
    },
  })

  const result$ = bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.GET_CURRENT_USER_ID_QUERY)),
    recv(TIMEOUT_MS)(
      query,
      Response,
    ),
    map(normalizeMessage),
  )

  m.expectObservable(result$).toBe(expected, values)
}))

test('recv() typing', async t => {
  const r = recv(1)(
    new dto.actions.queries.GetCurrentUserIdQuery(''),
    dto.actions.responses.GetCurrentUserIdQueryResponse,
  )

  type EXPECTED = (source$: BusObs) => Observable<InstanceType<typeof dto.actions.responses.GetCurrentUserIdQueryResponse>>

  type PARAMETERS           = Parameters<typeof r>
  type EXPECTED_PARAMETERS  = Parameters<EXPECTED>

  type RETURN           = ReturnType<typeof r>
  type EXPECTED_RETURN  = ReturnType<EXPECTED>

  const parametersTest: AssertEqual<PARAMETERS, EXPECTED_PARAMETERS> = true
  const returnTest:     AssertEqual<RETURN,     EXPECTED_RETURN>     = true

  t.ok(parametersTest, 'should match typing for parameters')
  t.ok(returnTest, 'should match typing for return')
})
