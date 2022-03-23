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
}                 from 'tstest'
import {
  createAction,
}                 from 'typesafe-actions'

import {
  metaResponse,
  MetaResponse,
}                       from './meta.js'
import {
  responseOf,
  RESPONSE,
  Responseable,
  ResponseTypeMap,
  responseTypeMap,
}                       from './response.js'

test('responseOf() typing', async t => {
  const RESPONSE_TYPE = 'XXX_RESPONSE'
  const payloadResponse = (res: MetaResponse & { data: string })  => ({ data: res.data })

  const responseAction = createAction(RESPONSE_TYPE, payloadResponse, metaResponse)()

  const responseable = {
    [RESPONSE]: responseAction,
  } as const

  const response    = responseOf(responseable)
  const rawResponse = responseable[RESPONSE]

  type RESULT_PARAMETERS    = Parameters<typeof response>
  type EXPECTED_PARAMETERS  = Parameters<typeof rawResponse>

  type RESULT_RETURN_TYPE    = ReturnType<typeof response>
  type EXPECTED_RETURN_TYPE  = ReturnType<typeof rawResponse>

  const testParameters: AssertEqual<RESULT_PARAMETERS, EXPECTED_PARAMETERS>   = true
  const testReturnType: AssertEqual<RESULT_RETURN_TYPE, EXPECTED_RETURN_TYPE> = true

  /**
   * FIXME: Huan(202203): `AssertEqual`: wrongly equals for types `any` and `[]`
   *  @link https://github.com/huan/tstest/issues/36
   */
  t.ok(testParameters, 'should typed Parameters correctly')
  t.ok(testReturnType, 'should typed ReturnType correctly')
})

test('Responseable typing', async t => {
  const RESPONSE_TYPE = 'XXX_RESPONSE'
  const payloadResponse = (res: MetaResponse & { data: string })  => ({ data: res.data })

  const trueAction = createAction(RESPONSE_TYPE, payloadResponse, metaResponse)()

  type ResultResponseable  = Responseable<typeof trueAction>
  type ResultResponse      = ResultResponseable[typeof RESPONSE]

  type RESULT_PARAMETERS    = Parameters<ResultResponse>
  type EXPECTED_PARAMETERS  = Parameters<typeof trueAction>

  type RESULT_RETURN_TYPE    = ReturnType<ResultResponse>
  type EXPECTED_RETURN_TYPE  = ReturnType<typeof trueAction>

  const testParameters: AssertEqual<RESULT_PARAMETERS, EXPECTED_PARAMETERS>   = true
  const testReturnType: AssertEqual<RESULT_RETURN_TYPE, EXPECTED_RETURN_TYPE> = true

  t.ok(testParameters, 'should typed Parameters correctly')
  t.ok(testReturnType, 'should typed ReturnType correctly')
})

test('ResponseTypeMap typing', async t => {
  const TYPES = {
    A_COMMAND : 'string/A_COMMAND',
    B_QUERY   : 'string/B_QUERY',
  } as const

  type EXPECTED = {
    A_COMMAND_RESPONSE : 'string/A_COMMAND_RESPONSE'
    B_QUERY_RESPONSE   : 'string/B_QUERY_RESPONSE'
  }
  const testTyping: AssertEqual<ResponseTypeMap<typeof TYPES>, EXPECTED>   = true

  t.ok(testTyping, 'should typed map correctly')
})

test('responseTypeMap()', async t => {
  const TYPES = {
    A_COMMAND : 'string/A_COMMAND',
    B_QUERY   : 'string/B_QUERY',
  } as const

  const EXPECTED = {
    A_COMMAND_RESPONSE : 'string/A_COMMAND_RESPONSE',
    B_QUERY_RESPONSE   : 'string/B_QUERY_RESPONSE',
  } as const

  const result = responseTypeMap(TYPES)
  t.same(result, EXPECTED, 'should map response correctly')

  const testTyping: AssertEqual<ResponseTypeMap<typeof TYPES>, typeof EXPECTED>   = true
  t.ok(testTyping, 'should typed response map correctly')
})
