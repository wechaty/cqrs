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
import { classify } from '../classify/classify.js'

import * as duck from '../duck/mod.js'

import { getResponseClassByType } from './get-object-creator-by-type.js'

test('getResponseClassByType() object payload', async t => {
  const PUPPET_ID = 'puppet-id'
  const SAYABLE = PUPPET.payloads.sayable.text('text')
  const CONVERSATION_ID = 'conversation-id'

  /**
   * setup cache
   */
  const warmUp = classify(duck.actions.sendMessageCommand)
  void warmUp

  const SendMessageCommandResponse = getResponseClassByType(duck.types.SEND_MESSAGE_COMMAND)

  const object    = new SendMessageCommandResponse(PUPPET_ID, CONVERSATION_ID, SAYABLE)
  const EXPECTED  = duck.actions.sendMessageCommandResponse({
    ...object.meta,
  })

  t.same(
    JSON.parse(JSON.stringify(object)),
    JSON.parse(JSON.stringify(EXPECTED)),
    'should set same object',
  )
})

test('getResponseClassByType() typing', async t => {
  const SendMessageCommand = getResponseClassByType(duck.types.SEND_MESSAGE_COMMAND)

  type ResultParameter    = ConstructorParameters<typeof SendMessageCommand>
  type ExpectedParameter  = Parameters<typeof duck.actions.sendMessageCommand>
  const testParameter: AssertEqual<
    ResultParameter,
    ExpectedParameter
  > = true
  t.ok(testParameter, 'should be same typing for parameters')

  type ResultObject = InstanceType<typeof SendMessageCommand>
  type ExpectedObject = ReturnType<typeof duck.actions.sendMessageCommand>
  const testObject: AssertEqual<
    ResultObject,
    ExpectedObject
  > = true
  t.ok(testObject, 'should be same typing for object')
})
