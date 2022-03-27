#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'

import * as duck from '../duck/mod.js'

import {
  typeActionMap,
}                     from './type-action-map.js'

test('typeActionMap smoke testing', async t => {
  const dingCommand = typeActionMap[duck.types.DING_COMMAND]
  t.equal(dingCommand, duck.actions.dingCommand, 'should get dingCommand')
})

test('typeActionMap typing', async t => {
  const dingCommand = typeActionMap[duck.types.DING_COMMAND]

  type RESULT   = typeof dingCommand
  type EXPECTED = typeof duck.actions.dingCommand

  const typing: AssertEqual<RESULT, EXPECTED> = true
  t.ok(typing, 'should get correct typing')
})
