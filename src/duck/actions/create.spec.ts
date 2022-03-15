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
import { test } from 'tstest'

import type { MetaResponse } from './meta.js'
import {
  create,
  messageCreator,
}                   from './create.js'

test('action create smoke testing', async t => {
  const QUERY_TYPE    = 'TEST_QUERY'
  const MESSAGE_TYPE  = 'TEST_MESSAGE'

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
  const EXPECTED_MESSAGE = {
    meta: {
      ...EXPECTED_QUERY.meta,
      gerror: undefined,
    },
    payload: {
      data: DATA,
    },
    type: MESSAGE_TYPE,
  }

  const payloadTestQuery    = (_puppetId: string, text: string)       => ({ text })
  const payloadTestMessage  = (res: MetaResponse & { data: string })  => ({ data: res.data })

  const getTestQuery = create(
    QUERY_TYPE,
    payloadTestQuery,
    MESSAGE_TYPE,
    payloadTestMessage,
  )
  const testGotMessage = messageCreator(getTestQuery)

  const query = getTestQuery(PUPPET_ID, TEXT)
  const message = testGotMessage({
    ...query.meta,
    data: DATA,
  })

  delete (query.meta as any).id
  delete (message.meta as any).id

  t.same(query, EXPECTED_QUERY, 'should get expected query')
  t.same(message, EXPECTED_MESSAGE, 'should get expected message')
})
