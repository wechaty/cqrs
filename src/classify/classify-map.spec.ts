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
    dongReceivedEvent:          duck.actions.dongReceivedEvent,
    sendMessageCommand:         duck.actions.sendMessageCommand,
    sendMessageCommandResponse: duck.actions.sendMessageCommandResponse,
  }

  const EXPECTED = {
    DongReceivedEvent:          classify(duck.actions.dongReceivedEvent),
    SendMessageCommand:         classify(duck.actions.sendMessageCommand),
    SendMessageCommandResponse: classify(duck.actions.sendMessageCommandResponse),
  }

  const classMap = classifyMap(actionMap)
  t.same(classMap, EXPECTED, 'should be the same of classMap & EXPECTED')

  const test: AssertEqual<typeof classMap, typeof EXPECTED> = true
  t.ok(test, 'should be the same typing of classMap & EXPECTED')
})
