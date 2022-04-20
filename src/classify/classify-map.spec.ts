#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}                     from 'tstest'

import * as duck from '../duck/mod.js'

import { classify }     from './classify.js'
import { classifyMap }  from './classify-map.js'

test('classify smoke testing', async t => {
  const actionMap = {
    DONG_RECEIVED_EVENT:            duck.actions.DONG_RECEIVED_EVENT,
    SEND_MESSAGE_COMMAND:           duck.actions.SEND_MESSAGE_COMMAND,
    SEND_MESSAGE_COMMAND_RESPONSE:  duck.actions.SEND_MESSAGE_COMMAND_RESPONSE,
  }

  const EXPECTED = {
    DongReceivedEvent:          classify(duck.actions.DONG_RECEIVED_EVENT),
    SendMessageCommand:         classify(duck.actions.SEND_MESSAGE_COMMAND),
    SendMessageCommandResponse: classify(duck.actions.SEND_MESSAGE_COMMAND_RESPONSE),
  }

  const classMap = classifyMap(actionMap)
  t.same(classMap, EXPECTED, 'should be the same of classMap & EXPECTED')

  const test: AssertEqual<typeof classMap, typeof EXPECTED> = true
  t.ok(test, 'should be the same typing of classMap & EXPECTED')
})
