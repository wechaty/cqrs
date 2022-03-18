#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  AssertEqual,
}               from 'tstest'

import {
  snakeToCamelCase,
  SnakeToCamelCase,
}                     from './snake-to-camel-case.js'

test('SnakeToCamelCase typing smoke testing', async t => {
  type SNAKE_CASE = 'SNAKE_CASE'
  type EXPECTED_CAMEL_CASE = 'SnakeCase'

  const test: AssertEqual<
    SnakeToCamelCase<SNAKE_CASE>,
    EXPECTED_CAMEL_CASE
  > = true
  t.ok(test, 'should convert typing correctly')
})

test('snakeToCamelCase() smoke testing', async t => {
  const SNAKE_CASE = 'SNAKE_CASE'
  const EXPECTED_CAMEL_CASE = 'SnakeCase'

  const result = snakeToCamelCase(SNAKE_CASE)
  const test: AssertEqual<
    typeof result,
    typeof EXPECTED_CAMEL_CASE
  > = true
  t.ok(test, 'should match typing')
})

test('snakeToCamelCase() fixture testing', async t => {
    const fixtures = [
    ['SNAKE_CASE', 'SnakeCase'],
    ['CAMEL_CASE', 'CamelCase'],
    ['UPPER', 'Upper'],
    ['THIS_IS_A_SNAKE_CASE', 'ThisIsASnakeCase'],
  ] as const

  for (const [snakeCase, expectedCamelCase] of fixtures) {
    const result = snakeToCamelCase(snakeCase)
    const test: AssertEqual<
      typeof result,
      typeof expectedCamelCase
    > = true
    t.ok(test, `should match typing ${snakeCase} -> ${expectedCamelCase}`)
  }

})
