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

import * as duck from '../duck/mod.js'

import { responseOf } from './response-of.js'

test('responseOf() object', async t => {
  const responseCreator = responseOf(duck.types.SEND_MESSAGE_COMMAND)
  t.equal(responseCreator, duck.actions.sendMessageCommandResponse, 'should get responseOf sendMessageCommand')
})

test('responseOf() typing', async t => {
  const responseCreator = responseOf(duck.types.SEND_MESSAGE_COMMAND)

  type RESULT   = typeof responseCreator
  type EXPECTED = typeof duck.actions.sendMessageCommandResponse

  const typingTest: AssertEqual<RESULT, EXPECTED> = true
  t.ok(typingTest, 'should typed response creator correctly')
})

// test('responseOf() typing with non-existing type', async t => {
//   const NON_EXISTING_TYPE = 'NON_EXISTING_TYPE'
//   const responseCreator = responseOf(NON_EXISTING_TYPE)

//   type RESULT   = typeof responseCreator
//   type EXPECTED = never

//   const typingTest: AssertEqual<RESULT, EXPECTED> = true
//   t.ok(typingTest, 'should typed non-existing type with `never`')
// })

test('responseOf() args with type & creator', async t => {
  const byType    = responseOf(duck.types.SEND_MESSAGE_COMMAND)
  const byCreator = responseOf(duck.actions.sendMessageCommand)
  t.equal(byType, byCreator, 'should be equal by type & creator')
})

test('responseOf() args with type & creator typings', async t => {
  const byType    = responseOf(duck.types.SEND_MESSAGE_COMMAND)
  const byCreator = responseOf(duck.actions.sendMessageCommand)

  const typingTest: AssertEqual<typeof byType, typeof byCreator> = true
  t.ok(typingTest, 'should be equal typing by type & creator')
})
