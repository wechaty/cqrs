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
    dingCommand:          duck.actions.dingCommand,
    dingCommandResponse:  duck.actions.dingCommandResponse,
    dongReceivedEvent:    duck.actions.dongReceivedEvent,
  }

  const EXPECTED = {
    dingCommand:          classify(duck.actions.dingCommand),
    dingCommandResponse:  classify(duck.actions.dingCommandResponse),
    dongReceivedEvent:    classify(duck.actions.dongReceivedEvent),
  }

  const classMap = classifyMap(actionMap)
  t.same(classMap, EXPECTED, 'should be the same of classMap & EXPECTED')

  const test: AssertEqual<typeof classMap, typeof EXPECTED> = true
  t.ok(test, 'should be the same typing of classMap & EXPECTED')
})
