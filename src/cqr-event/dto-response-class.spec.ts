#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License")
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  test,
  AssertEqual,
}                   from 'tstest'

import * as duck    from '../duck/mod.js'

import { dtoClass }   from './dto-class.js'
import { dtoResponseClass } from './dto-response-class.js'

test('dtoResponseClass() by type, creator, and class', async t => {
  const ByType    = dtoResponseClass(duck.types.GET_IS_LOGGED_IN_QUERY)
  const ByCreator = dtoResponseClass(duck.actions.GET_IS_LOGGED_IN_QUERY)
  const byClass   = dtoResponseClass(dtoClass(duck.types.GET_IS_LOGGED_IN_QUERY))

  t.equal(ByType, ByCreator, 'should be equal by type & creator')
  t.equal(ByType, byClass, 'should be equal by type & class')
})

test('dtoResponseClass() object payload', async t => {
  const PUPPET_ID = 'puppet-id'
  const ID = 'id'

  const GetIsLoggedInQueryResponse = dtoResponseClass(duck.types.GET_IS_LOGGED_IN_QUERY)

  const object = new GetIsLoggedInQueryResponse({
    id: ID,
    isLoggedIn: true,
    puppetId: PUPPET_ID,
  })
  const EXPECTED  = duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE({
    ...object.meta,
    isLoggedIn: object.payload.isLoggedIn,
  })

  t.same(
    JSON.parse(JSON.stringify(object)),
    JSON.parse(JSON.stringify(EXPECTED)),
    'should set same object',
  )
})

test('dtoResponseClass() typing', async t => {
  const GetIsLoggedInQuery = dtoResponseClass(duck.types.GET_IS_LOGGED_IN_QUERY)

  type ResultParameter    = ConstructorParameters<typeof GetIsLoggedInQuery>
  type ExpectedParameter  = Parameters<typeof duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE>
  const testParameter: AssertEqual<
    ResultParameter,
    ExpectedParameter
  > = true
  t.ok(testParameter, 'should be same typing for parameters')

  type ResultObject = InstanceType<typeof GetIsLoggedInQuery>
  type ExpectedObject = ReturnType<typeof duck.actions.GET_IS_LOGGED_IN_QUERY_RESPONSE>
  const testObject: AssertEqual<
    ResultObject,
    ExpectedObject
  > = true
  t.ok(testObject, 'should be same typing for object')
})
