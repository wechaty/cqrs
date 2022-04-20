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
import { test } from 'tstest'

import * as Duck from '../duck/mod.js'

import * as actionFilter from './action-filter.js'

test('action filter smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const CONVERSATION_ID = 'conversation-id'

  const COMMAND   = Duck.actions.SEND_MESSAGE_COMMAND(PUPPET_ID, CONVERSATION_ID, {} as any)
  const EVENT     = Duck.actions.DONG_RECEIVED_EVENT(PUPPET_ID, { data: 'data' })
  const RESPONSE  = Duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE({
    id: 'id',
    isLoggedIn: false,
    puppetId: PUPPET_ID,
  })
  const QUERY   = Duck.actions.GET_IS_LOGGED_IN_QUERY(PUPPET_ID)
  const DUMMY   = { type: 'fadsfadsfasdfasd' }

  const fixtures = [
    [COMMAND,   1, 0, 0, 0],
    [EVENT,     0, 1, 0, 0],
    [RESPONSE,  0, 0, 1, 0],
    [QUERY,     0, 0, 0, 1],
    [DUMMY,     0, 0, 0, 0],
  ] as const

  for (const [e, ...expected] of fixtures) {
    const isCommand   = +actionFilter.isCommand(e)
    const isEvent     = +actionFilter.isEvent(e)
    const isResponse  = +actionFilter.isResponse(e)
    const isQuery     = +actionFilter.isQuery(e)

    t.same([isCommand, isEvent, isResponse, isQuery], expected, `should match ${e.type} to ${expected}`)
  }
})
