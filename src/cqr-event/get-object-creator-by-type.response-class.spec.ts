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

import { getResponseClassByType } from './get-object-creator-by-type.js'

test('getResponseClassByType() object payload', async t => {
  const PUPPET_ID = 'puppet-id'
  const ID = 'id'

  const GetIsLoggedInQueryResponse = getResponseClassByType(duck.types.GET_IS_LOGGED_IN_QUERY)

  const object = new GetIsLoggedInQueryResponse({
    id: ID,
    isLoggedIn: true,
    puppetId: PUPPET_ID,
  })
  const EXPECTED  = duck.actions.getIsLoggedInQueryResponse({
    ...object.meta,
    isLoggedIn: object.payload.isLoggedIn,
  })

  t.same(
    JSON.parse(JSON.stringify(object)),
    JSON.parse(JSON.stringify(EXPECTED)),
    'should set same object',
  )
})

test('getResponseClassByType() typing', async t => {
  const GetIsLoggedInQuery = getResponseClassByType(duck.types.GET_IS_LOGGED_IN_QUERY)

  type ResultParameter    = ConstructorParameters<typeof GetIsLoggedInQuery>
  type ExpectedParameter  = Parameters<typeof duck.actions.getIsLoggedInQueryResponse>
  const testParameter: AssertEqual<
    ResultParameter,
    ExpectedParameter
  > = true
  t.ok(testParameter, 'should be same typing for parameters')

  type ResultObject = InstanceType<typeof GetIsLoggedInQuery>
  type ExpectedObject = ReturnType<typeof duck.actions.getIsLoggedInQueryResponse>
  const testObject: AssertEqual<
    ResultObject,
    ExpectedObject
  > = true
  t.ok(testObject, 'should be same typing for object')
})
