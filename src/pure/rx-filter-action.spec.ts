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
import {
  of,
  firstValueFrom,
}                   from 'rxjs'
import {
  count,
}                   from 'rxjs/operators'

import * as Duck from '../duck/mod.js'

import * as rxFilterAction from './rx-filter-action.js'

test('rx filter action smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const CONVERSATION_ID = 'conversation-id'

  const COMMAND   = Duck.actions.sendMessageCommand(PUPPET_ID, CONVERSATION_ID, {} as any)
  const EVENT     = Duck.actions.dongReceivedEvent(PUPPET_ID, { data: 'data' })
  const RESPONSE  = Duck.actions.dingCommandResponse({
    id: 'uuid',
    puppetId: PUPPET_ID,
  })
  const QUERY   = Duck.actions.getIsLoggedInQuery(PUPPET_ID)
  const DUMMY   = { type: 'fadsfadsfasdfasd' }

  const fixtures = [
    [COMMAND, 1, 0, 0, 0],
    [EVENT,   0, 1, 0, 0],
    [RESPONSE, 0, 0, 1, 0],
    [QUERY,   0, 0, 0, 1],
    [DUMMY,   0, 0, 0, 0],
  ] as const

  for (const [e, ...expected] of fixtures) {
    const $ = of(e)

    const isCommand   = await firstValueFrom($.pipe(rxFilterAction.filterCommand(),   count()))
    const isEvent     = await firstValueFrom($.pipe(rxFilterAction.filterEvent(),     count()))
    const isResponse  = await firstValueFrom($.pipe(rxFilterAction.filterResponse(),  count()))
    const isQuery     = await firstValueFrom($.pipe(rxFilterAction.filterQuery(),     count()))

    t.same([isCommand, isEvent, isResponse, isQuery], expected, `should match ${e.type} to ${expected}`)
  }
})
