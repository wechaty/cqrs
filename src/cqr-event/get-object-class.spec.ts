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

import { getObjectClass } from './get-object-class.js'

test('getObjectClass() by type & action', async t => {
  const ByType    = getObjectClass(duck.types.SEND_MESSAGE_COMMAND)
  const ByAction  = getObjectClass(duck.actions.sendMessageCommand)
  t.equal(ByType, ByAction, 'should be equal')
})

test('getObjectClass() payload', async t => {
  const PUPPET_ID = 'puppet-id'
  const SAYABLE = PUPPET.payloads.sayable.text('text')
  const CONVERSATION_ID = 'conversation-id'

  const SendMessageCommand = getObjectClass(duck.types.SEND_MESSAGE_COMMAND)

  const object = new SendMessageCommand(PUPPET_ID, CONVERSATION_ID, SAYABLE)
  const EXPECTED = duck.actions.sendMessageCommand(PUPPET_ID, CONVERSATION_ID, SAYABLE)

  delete (object.meta as any).id
  delete (EXPECTED.meta as any).id

  t.same(
    JSON.parse(JSON.stringify(object)),
    JSON.parse(JSON.stringify(EXPECTED)),
    'should set same action',
  )
})

test('getObjectClass() typing', async t => {
  const SendMessageCommand = getObjectClass(duck.types.SEND_MESSAGE_COMMAND)

  const testParameter: AssertEqual<
    ConstructorParameters<typeof SendMessageCommand>,
    Parameters<typeof duck.actions.sendMessageCommand>
  > = true
  const testObject: AssertEqual<
    InstanceType<typeof SendMessageCommand>,
    ReturnType<typeof duck.actions.sendMessageCommand>
  > = true

  t.ok(testParameter, 'should be same typing for parameters')
  t.ok(testObject, 'should be same typing for object')
})
