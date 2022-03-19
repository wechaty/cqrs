#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'

import {
  type PureTypeName,
  pureTypeName,
}                     from './pure-type-name.js'

test('PureTypeName typing smoke testing', async t => {
  type TYPE_NAME = 'cqrs-wechaty/SNAKE_CASE'
  type EXPECTED_SNAKE_CASE = 'SNAKE_CASE'

  const test: AssertEqual<
    PureTypeName<TYPE_NAME>,
    EXPECTED_SNAKE_CASE
  > = true
  t.ok(test, 'should convert typing correctly')
})

test('pureTypeName() smoke testing', async t => {
  const TYPE_NAME = 'cqrs-wechaty/SNAKE_CASE'
  const EXPECTED_SNAKE_CASE = 'SNAKE_CASE'

  const result = pureTypeName(TYPE_NAME)
  t.equal(result, EXPECTED_SNAKE_CASE, 'should get pure name')
})

test('pureTypeName() fixture testing', async t => {
  const fixtures = [
    ['cqrs-wechaty/SNAKE_CASE',           'SNAKE_CASE'],
    ['cqrs-wechaty/CAMEL_CASE',           'CAMEL_CASE'],
    ['cqrs-wechaty/UPPER',                'UPPER'],
    ['cqrs-wechaty/THIS_IS_A_SNAKE_CASE', 'THIS_IS_A_SNAKE_CASE'],
  ] as const

  for (const [typeName, expectedPureName] of fixtures) {
    const result = pureTypeName(typeName)
    const test: AssertEqual<
      typeof result,
      typeof expectedPureName
    > = true
    t.ok(test, `should match typing ${typeName} -> ${expectedPureName}`)
    t.equal(result, expectedPureName, `should convert ${typeName} -> ${expectedPureName}`)
  }
})
