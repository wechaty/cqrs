#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License")
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
  AssertEqual,
}                 from 'tstest'
import {
  createAction,
}                 from 'typesafe-actions'

import {
  metaRequest,
  metaResponse,
  MetaResponse,
}                       from './meta.js'
import {
  createWithResponse,
  responseOf,
  ResponsePair,
}                       from './response-pair.js'
import {
  RESPONSE,
}                       from './response.js'

test('action create smoke testing', async t => {
  const QUERY_TYPE    = 'TEST_QUERY'
  const RESPONSE_TYPE = 'TEST_QUERY_RESPONSE'

  const PUPPET_ID = 'puppet-id'
  const DATA = 'data'
  const TEXT = 'text'

  const EXPECTED_QUERY = {
    meta: {
      puppetId: PUPPET_ID,
    },
    payload: {
      text: TEXT,
    },
    type: QUERY_TYPE,
  }
  const EXPECTED_RESPONSE = {
    meta: {
      ...EXPECTED_QUERY.meta,
      gerror: undefined,
    },
    payload: {
      data: DATA,
    },
    type: RESPONSE_TYPE,
  }

  const payloadTestQuery    = (_puppetId: string, text: string)       => ({ text })
  const payloadTestMessage  = (res: MetaResponse & { data: string })  => ({ data: res.data })

  const getTestQuery = createWithResponse(
    QUERY_TYPE,
    payloadTestQuery,
    payloadTestMessage,
  )
  const getTestQueryResponse = responseOf(getTestQuery)

  const query = getTestQuery(PUPPET_ID, TEXT)
  const response = getTestQueryResponse({
    ...query.meta,
    data: DATA,
  })

  delete (query.meta as any).id
  delete (response.meta as any).id

  t.same(query, EXPECTED_QUERY, 'should get expected query')
  t.same(response, EXPECTED_RESPONSE, 'should get expected message')
})

test('Pair static typing', async t => {
  const payloadQuery    = (_puppetId: string, text: string)       => ({ text })
  const payloadResponse = (res: MetaResponse & { data: string })  => ({ data: res.data })

  const query     = createAction('QUERY',     payloadQuery,     metaRequest)()
  const response  = createAction('RESPONSE',  payloadResponse,  metaResponse)()

  const test: AssertEqual<
    ResponsePair<typeof query, typeof response>,
    typeof query & {
      [RESPONSE]: typeof response
    }
  > = true
  t.ok(test, 'should be expected typing')
})
