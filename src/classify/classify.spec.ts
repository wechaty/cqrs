#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'
import UUID from 'uuid'

import * as duck from '../duck/mod.js'

import {
  classify,
}                     from './classify.js'

test('classify smoke testing', async t => {
  const DingCommand                = classify(duck.actions.dingCommand)
  const DingCommandResponse        = classify(duck.actions.dingCommandResponse)
  const GetIsLoggedInQuery         = classify(duck.actions.getIsLoggedInQuery)
  const GetIsLoggedInQueryResponse = classify(duck.actions.getIsLoggedInQueryResponse)
  const DongReceivedEvent          = classify(duck.actions.dongReceivedEvent)

  const PUPPET_ID = 'puppet-id'
  const DATA = 'data'
  const ID = UUID.v4()

  const fixtures = [
    [
      new DingCommand(PUPPET_ID, DATA),
      duck.actions.dingCommand(PUPPET_ID, DATA),
    ],
    [
      new DingCommandResponse({ id: ID, puppetId: PUPPET_ID }),
      duck.actions.dingCommandResponse({ id: ID, puppetId: PUPPET_ID }),
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
    t.same(instance, payload, `should be the same of class (${instance.constructor.name}) & payload (${payload.type})`)
  }
})

test('classify parameters typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)

  const test: AssertEqual<
    ConstructorParameters<typeof DingCommand>,
    Parameters<typeof duck.actions.dingCommand>
  > = true
  t.ok(test, 'should be the same of class constructor parameters & payload creator parameters')
})

test('classify interface typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)

  const test: AssertEqual<
    InstanceType<typeof DingCommand>,
    ReturnType<typeof duck.actions.dingCommand>
  > = true
  t.ok(test, 'should be the same of class instance interface & payload interface')
})

test('classify type typing', async t => {
  const DingCommand = classify(duck.actions.dingCommand)
  const command = new DingCommand('id', 'data')

  const test: AssertEqual<
    typeof command.type,
    typeof duck.types.DING_COMMAND
  > = true
  t.ok(test, 'should be the same of class instance type & payload type')
})
