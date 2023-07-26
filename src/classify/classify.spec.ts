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
  test,
  AssertEqual,
}                     from 'tstest'
import * as UUID      from 'uuid'
import * as PUPPET    from 'wechaty-puppet'
import { isActionOf } from 'typesafe-actions'

import * as duck    from '../duck/mod.js'

import { classify } from './classify.js'

test('classify smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const DATA      = 'data'

  const DingCommand = classify(duck.actions.DING_COMMAND)

  const instance = new DingCommand(PUPPET_ID, DATA)
  const payload = duck.actions.DING_COMMAND(PUPPET_ID, DATA)

  delete (instance.meta as any).id
  delete (payload.meta as any).id
  delete (instance as any).toString
  delete (payload as any).toString

  t.same(instance, payload, 'should be same of payload and instance')
})

test('classify a string type', async t => {
  const ClassFromCreator  = classify(duck.actions.DING_COMMAND)
  const ClassFromType     = classify(duck.types.DING_COMMAND)

  t.equal(ClassFromCreator, ClassFromType, 'should be same class either from creator or type')
})

test('classify Command, Query, Response, and Event testing', async t => {
  const SendMessageCommand          = classify(duck.actions.SEND_MESSAGE_COMMAND)
  const SendMessageCommandResponse  = classify(duck.actions.SEND_MESSAGE_COMMAND_RESPONSE)
  const GetIsLoggedInQuery          = classify(duck.actions.GET_IS_LOGGED_IN_QUERY)
  const GetIsLoggedInQueryResponse  = classify(duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE)
  const DongReceivedEvent           = classify(duck.actions.DONG_RECEIVED_EVENT)

  const PUPPET_ID       = 'puppet-id'
  const DATA            = 'data'
  const SAYABLE         = PUPPET.payloads.sayable.text('test')
  const CONVERSATION_ID = 'conversation-id'
  const ID              = UUID.v4()

  const fixtures = [
    [
      new SendMessageCommand(PUPPET_ID, CONVERSATION_ID, SAYABLE),
      duck.actions.SEND_MESSAGE_COMMAND(PUPPET_ID, CONVERSATION_ID, SAYABLE),
    ],
    [
      new SendMessageCommandResponse({ id: ID, puppetId: PUPPET_ID }),
      duck.actions.SEND_MESSAGE_COMMAND_RESPONSE({ id: ID, puppetId: PUPPET_ID }),
    ],
    [
      new GetIsLoggedInQuery(PUPPET_ID),
      duck.actions.GET_IS_LOGGED_IN_QUERY(PUPPET_ID),
    ],
    [
      new GetIsLoggedInQueryResponse({ id: ID, puppetId: PUPPET_ID }),
      duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE({ id: ID, puppetId: PUPPET_ID }),
    ],
    [
      new DongReceivedEvent(PUPPET_ID, { data: DATA }),
      duck.actions.DONG_RECEIVED_EVENT(PUPPET_ID, { data: DATA }),
    ],
  ] as const

  for (const [ instance, payload ] of fixtures) {
    delete (instance.meta as any).id
    delete (payload.meta as any).id
    delete (instance as any).toString
    delete (payload as any).toString
    t.same(instance, payload, `should be the same of class (${instance.constructor.name}) & payload (${payload.type})`)
  }
})

test('classify class constructor parameters typing', async t => {
  const DingCommand = classify(duck.actions.DING_COMMAND)

  const test: AssertEqual<
    ConstructorParameters<typeof DingCommand>,
    Parameters<typeof duck.actions.DING_COMMAND>
  > = true
  t.ok(test, 'should be the same of class constructor parameters & payload creator parameters')
})

test('classify class instance typing: from an actionCreator', async t => {
  const DingCommand = classify(duck.actions.DING_COMMAND)

  const test: AssertEqual<
    InstanceType<typeof DingCommand>,
    ReturnType<typeof duck.actions.DING_COMMAND>
  > = true
  t.ok(test, 'should be the same of class instance interface & payload interface')
})

test('classify class instance typing: from a type string', async t => {
  const SendMessageCommand = classify(duck.types.SEND_MESSAGE_COMMAND)!

  type RESULT   = InstanceType<typeof SendMessageCommand>
  type EXPECTED = ReturnType<typeof duck.actions.SEND_MESSAGE_COMMAND>

  const test: AssertEqual<
    RESULT,
    EXPECTED
  > = true
  t.ok(test, 'should be the same of class instance interface & payload interface')
})

test('actionCreator toString()', async t => {
  t.equal(duck.actions.DING_COMMAND.toString(), duck.types.DING_COMMAND, 'should toString to type')
})

test('class toString()', async t => {
  const DingCommand = classify(duck.actions.DING_COMMAND)
  t.equal(DingCommand.toString(), duck.types.DING_COMMAND, 'should toString to type')
})

test('class getType!()', async t => {
  const DingCommand = classify(duck.actions.DING_COMMAND)
  t.equal(DingCommand.getType!(), duck.types.DING_COMMAND, 'should class getType to type')
})

test('instance toString()', async t => {
  const DingCommand = classify(duck.actions.DING_COMMAND)
  const dingCommand = new DingCommand('')
  t.equal(dingCommand.toString(), duck.types.DING_COMMAND, 'should instance toString to type')
})

test('isActionOf filter', async t => {
  const DingCommand       = classify(duck.actions.DING_COMMAND)
  const DongReceivedEvent = classify(duck.actions.DONG_RECEIVED_EVENT)

  const dingCommand       = new DingCommand('')
  const dongReceivedEvent = new DongReceivedEvent('', {})

  const isDingCommandOf = isActionOf(DingCommand)

  t.ok(isDingCommandOf(dingCommand), 'should identify dingCommand is a DingCommand')
  t.notOk(isDingCommandOf(dongReceivedEvent), 'should identify dongReceivedEvent not a DingCommand')
})

test('classify cache & singleton', async t => {
  const first   = classify(duck.actions.DING_COMMAND)
  const second  = classify(duck.actions.DING_COMMAND)

  t.equal(first, second, 'should be the same of class constructor when we classify multiple times as we are using cache & singleton')
})

test('classify class compatible new & call', async t => {
  const PUPPET_ID = 'puppet-id'
  const DATA = 'data'

  const DingCommand = classify(duck.actions.DING_COMMAND)
  const that = { DingCommand }

  const c = DingCommand(PUPPET_ID, DATA)
  const m = that.DingCommand(PUPPET_ID, DATA)
  const n = new DingCommand(PUPPET_ID, DATA)

  t.ok(c instanceof DingCommand, 'should be instance of DingCommand for c')
  t.ok(m instanceof DingCommand, 'should be instance of DingCommand for m')
  t.ok(n instanceof DingCommand, 'should be instance of DingCommand for n')

  delete (c as any).meta.id
  delete (m as any).meta.id
  delete (n as any).meta.id

  t.same(c, m, 'should be the same of class instance when we call new & module class constructor')
  t.same(c, n, 'should be the same of class instance when we call new & class constructor')
})
