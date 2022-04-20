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
}                   from 'tstest'
import * as PUPPET  from 'wechaty-puppet'

import * as duck from '../duck/mod.js'

import { dtoFactory } from './dto-factory.js'

test('dtoFactory() payload', async t => {
  const PUPPET_ID = 'puppet-id'
  const SAYABLE = PUPPET.payloads.sayable.text('text')
  const CONVERSATION_ID = 'conversation-id'

  const creator = dtoFactory(duck.types.SEND_MESSAGE_COMMAND)

  const object = creator(PUPPET_ID, CONVERSATION_ID, SAYABLE)
  const EXPECTED = duck.actions.SEND_MESSAGE_COMMAND(PUPPET_ID, CONVERSATION_ID, SAYABLE)

  delete (object.meta as any).id
  delete (EXPECTED.meta as any).id

  t.same(object, EXPECTED, 'should set same action')
})

test('dtoFactory() typing', async t => {
  const creator = dtoFactory(duck.types.SEND_MESSAGE_COMMAND)

  const test: AssertEqual<
    typeof creator,
    typeof duck.actions.SEND_MESSAGE_COMMAND
  > = true
  t.ok(test, 'should be same typing')
})

test('dtoFactory() reference compare', async t => {
  t.equal(
    dtoFactory(duck.types.SEND_MESSAGE_COMMAND),
    duck.actions.SEND_MESSAGE_COMMAND,
    'should be the same function reference',
  )
})
