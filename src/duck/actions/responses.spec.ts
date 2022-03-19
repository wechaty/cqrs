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
import { AssertEqual, test } from 'tstest'

import * as types from '../types/mod.js'

import * as responses from './responses.js'

test('responses smoke testing', async t => {
  const ID = 'uuidv4'
  const PUPPET_ID = 'puppet-id'
  const IS_LOGGED_IN = true

  const response = responses.getIsLoggedInQueryResponse({
    id         : ID,
    isLoggedIn : IS_LOGGED_IN,
    puppetId   : PUPPET_ID,
  })

  t.ok(response.meta.id, 'should set id to meta')
  t.equal(response.meta.puppetId, PUPPET_ID, 'should set puppetId to meta')
  t.same(response.payload.isLoggedIn, IS_LOGGED_IN, `should set isLoggedIn to ${IS_LOGGED_IN}`)
})

test('responses type testing', async t => {
  const response = responses.getIsLoggedInQueryResponse({} as any)

  const test: AssertEqual<
    typeof response.type,
    `${typeof types.GET_IS_LOGGED_IN_QUERY}_RESPONSE`
  > = true
  t.ok(test, 'should have a typed type value')
  t.equal(response.type, `${types.GET_IS_LOGGED_IN_QUERY}_RESPONSE`, 'should be equal to types')
})
