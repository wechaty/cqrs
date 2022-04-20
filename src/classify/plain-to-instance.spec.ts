#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import * as actions from '../duck/actions/mod.js'

import { plainToInstance }  from './plain-to-instance.js'
import { classify }         from './classify.js'

test('plainToClass smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const DATA = 'data'

  const DingCommand = classify(actions.DING_COMMAND)

  const plainObject     = actions.DING_COMMAND(PUPPET_ID, DATA)
  const instanceObject  = plainToInstance(plainObject)

  t.ok(instanceObject instanceof DingCommand, 'should convert to class object')
  t.same(plainObject, instanceObject, 'should be equal for all payloads')
  t.same(
    JSON.parse(JSON.stringify(plainObject)),
    JSON.parse(JSON.stringify(instanceObject)),
    'should be equal for all payloads (JSON)',
  )
})

test('plainToClass return `undefined` for the unknown object', async t => {
  const plainObject     = { type: 'unknown' } as any
  const instanceObject  = plainToInstance(plainObject)

  t.equal(instanceObject, undefined, 'should be return `undefined` if it can not be recongnized')
})
