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

import * as duck from '../duck/mod.js'

import { dtoResponseFactory } from './dto-response-factory.js'

test('dtoResponseFactory() with type & action', async t => {
  const byType    = dtoResponseFactory(duck.types.SEND_MESSAGE_COMMAND)
  const byAction  = dtoResponseFactory(duck.actions.SEND_MESSAGE_COMMAND)
  t.equal(byType, byAction, 'should be equal')
})

test('dtoResponseFactory() payload', async t => {
  const ID        = 'id'
  const PUPPET_ID = 'puppet-id'

  const responseCreator = dtoResponseFactory(duck.types.SEND_MESSAGE_COMMAND)

  const object = responseCreator({
    id: ID,
    puppetId: PUPPET_ID,
  })
  const EXPECTED = duck.actions.SEND_MESSAGE_COMMAND_RESPONSE({ ...object.meta })

  t.same(object, EXPECTED, 'should set same object')
})

test('dtoResponseFactory() typing', async t => {
  const responseCreator = dtoResponseFactory(duck.types.SEND_MESSAGE_COMMAND)

  type RESULT   = typeof responseCreator
  type EXPECTED = typeof duck.actions.SEND_MESSAGE_COMMAND_RESPONSE

  const test: AssertEqual<
    RESULT,
    EXPECTED
  > = true
  t.ok(test, 'should be same typing')
})

test('dtoResponseFactory() reference compare', async t => {
  const responseCreator = dtoResponseFactory(duck.types.SEND_MESSAGE_COMMAND)

  t.equal(
    responseCreator,
    duck.actions.SEND_MESSAGE_COMMAND_RESPONSE,
    'should be the same function reference',
  )
})
