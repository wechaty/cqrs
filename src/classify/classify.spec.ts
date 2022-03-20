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
import UUID           from 'uuid'
import { isActionOf } from 'typesafe-actions'
import * as PUPPET    from 'wechaty-puppet'

import * as duck    from '../duck/mod.js'

import { classify } from './classify.js'

test('classify smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const DATA      = 'data'

  const DingCommand = classify(duck.actions.dingCommand)

  const instance = new DingCommand(PUPPET_ID, DATA)
  const payload = duck.actions.dingCommand(PUPPET_ID, DATA)

  delete (instance.meta as any).id
  delete (payload.meta as any).id
  delete (instance as any).toString
  delete (payload as any).toString

  t.same(instance, payload, 'should be same of payload and instance')
})

test('classify Command, Query, Response, and Event testing', async t => {
  const SendMessageCommand          = classify(duck.actions.sendMessageCommand)
  const SendMessageCommandResponse  = classify(duck.actions.sendMessageCommandResponse)
  const GetIsLoggedInQuery          = classify(duck.actions.getIsLoggedInQuery)
  const GetIsLoggedInQueryResponse  = classify(duck.actions.getIsLoggedInQueryResponse)
  const DongReceivedEvent           = classify(duck.actions.dongReceivedEvent)

  const PUPPET_ID       = 'puppet-id'
  const DATA            = 'data'
  const SAYABLE         = PUPPET.payloads.sayable.text('test')
  const CONVERSATION_ID = 'conversation-id'
  const ID              = UUID.v4()

  const fixtures = [
    [
      new SendMessageCommand(PUPPET_ID, CONVERSATION_ID, SAYABLE),
      duck.actions.sendMessageCommand(PUPPET_ID, CONVERSATION_ID, SAYABLE),
    ],
    [
      new SendMessageCommandResponse({ id: ID, puppetId: PUPPET_ID }),
      duck.actions.sendMessageCommandResponse({ id: ID, puppetId: PUPPET_ID }),
    ],
    [
      new GetIsLoggedInQuery(PUPPET_ID),
      duck.actions.getIsLoggedInQuery(PUPPET_ID),
    ],
    [
      new GetIsLoggedInQueryResponse({ id: ID, puppetId: PUPPET_ID }),
      duck.actions.getIsLoggedInQueryResponse({ id: ID, puppetId: PUPPET_ID }),
    ],
    [
      new DongReceivedEvent(PUPPET_ID, { data: DATA }),
      duck.actions.dongReceivedEvent(PUPPET_ID, { data: DATA }),
    ],
  ] as const

  for (const [instance, payload] of fixtures) {
    delete (instance.meta as any).id
    delete (payload.meta as any).id
    delete (instance as any).toString
    delete (payload as any).toString
    t.same(instance, payload, `should be the same of class (${instance.constructor.name}) & payload (${payload.type})`)
  }
})

test('classify class constructor parameters typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)

  const test: AssertEqual<
    ConstructorParameters<typeof DingCommand>,
    Parameters<typeof duck.actions.dingCommand>
  > = true
  t.ok(test, 'should be the same of class constructor parameters & payload creator parameters')
})

test('classify class instance typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)

  const test: AssertEqual<
    InstanceType<typeof DingCommand>,
    ReturnType<typeof duck.actions.dingCommand>
  > = true
  t.ok(test, 'should be the same of class instance interface & payload interface')
})

test('classify class type typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)
  const command = new DingCommand('id', 'data')

  const test: AssertEqual<
    typeof command.type,
    typeof duck.types.DING_COMMAND
  > = true
  t.ok(test, 'should be the same of class instance type & payload type')
})

test('actionCreator toString()', async t => {
  t.equal(duck.actions.dingCommand.toString(), duck.types.DING_COMMAND, 'should toString to type')
})

test('class toString()', async t => {
  const DingCommand = classify(duck.actions.dingCommand)
  t.equal(DingCommand.toString(), duck.types.DING_COMMAND, 'should toString to type')
})

test('class getType!()', async t => {
  const DingCommand = classify(duck.actions.dingCommand)
  t.equal(DingCommand.getType!(), duck.types.DING_COMMAND, 'should class getType to type')
})

test('instance toString()', async t => {
  const DingCommand = classify(duck.actions.dingCommand)
  const dingCommand = new DingCommand('')
  t.equal(dingCommand.toString(), duck.types.DING_COMMAND, 'should instance toString to type')
})

test('isActionOf filter', async t => {
  const DingCommand       = classify(duck.actions.dingCommand)
  const DongReceivedEvent = classify(duck.actions.dongReceivedEvent)

  const dingCommand       = new DingCommand('')
  const dongReceivedEvent = new DongReceivedEvent('', {})

  const isDingCommandOf = isActionOf(DingCommand)

  t.ok(isDingCommandOf(dingCommand), 'should identify dingCommand is a DingCommand')
  t.notOk(isDingCommandOf(dongReceivedEvent), 'should identify dongReceivedEvent not a DingCommand')
})

test('classify cache & singleton', async t => {
  const first   = classify(duck.actions.dingCommand)
  const second  = classify(duck.actions.dingCommand)

  t.equal(first, second, 'should be the same of class constructor when we classify multiple times as we are using cache & singleton')
})
