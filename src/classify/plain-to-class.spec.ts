#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import * as actions from '../duck/actions/mod.js'

import { plainToClass } from './plain-to-class.js'
import { classify }     from './classify.js'

test('plainToClass smoke testing', async t => {
  const PUPPET_ID = 'puppet-id'
  const DATA = 'data'

  const DingCommand = classify(actions.dingCommand)

  const plainObject = actions.dingCommand(PUPPET_ID, DATA)
  const classObject = plainToClass(plainObject)

  t.ok(classObject instanceof DingCommand, 'should convert to class object')
  t.same(plainObject, classObject, 'should be equal for all payloads')
  t.same(
    JSON.parse(JSON.stringify(plainObject)),
    JSON.parse(JSON.stringify(classObject)),
    'should be equal for all payloads (JSON)',
  )
})

test('plainToClass return `undefined` for the unknown object', async t => {
  const plainObject     = { type: 'unknown' } as any
  const returnedObject  = plainToClass(plainObject)

  t.equal(returnedObject, undefined, 'should be return `undefined` if it can not be recongnized')
})
