#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'

import * as duck from '../duck/mod.js'

import { peekType } from './peek-type.js'

test('peekType smoke testing', async t => {
  const type = peekType(duck.actions.dingCommand)
  const test: AssertEqual<
    typeof type,
    typeof duck.types.DING_COMMAND
  > = true
  t.ok(test, 'should get type')
  t.equal(type, duck.types.DING_COMMAND, 'should be equal to types')
})

test('peekType for Response', async t => {
  const type = peekType(duck.actions.getIsLoggedInQueryResponse)
  const test: AssertEqual<
    typeof type,
    `${typeof duck.types.GET_IS_LOGGED_IN_QUERY}_RESPONSE`
  > = true
  t.ok(test, 'should get type')
  t.equal(type, `${duck.types.GET_IS_LOGGED_IN_QUERY}_RESPONSE`, 'should be equal to types')
})
