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

import * as mod   from './mod.js'

test('mod export packageJson', async t => {
  t.ok(mod.NAME, 'should export NAME')
  t.ok(mod.VERSION, 'should export VERSION')
})

test('mod export Commands, Queries, Responses, and Events', async t => {
  t.ok(mod.commands, 'should export commands')
  t.ok(mod.commands.DingCommand, 'should export commands.dingCommand')
  t.ok(mod.queries, 'should export queries')
  t.ok(mod.queries.GetIsLoggedInQuery, 'should export queries.getIsLoggedInQuery')
  t.ok(mod.responses, 'should export responses')
  t.ok(mod.responses.GetIsLoggedInQueryResponse, 'should export responses.getIsLoggedInQueryResponse')
  t.ok(mod.events, 'should export event')
  t.ok(mod.events.StartedEvent, 'should export events.startedEvent')
})

test('mod export Bus and BusObs', async t => {
  const busOk: AssertEqual<
    mod.Bus,
    mod.Bus
  > = true

  const busObsOk: AssertEqual<
    mod.BusObs,
    mod.BusObs
  > = true

  t.ok(busOk, 'should export Bus type')
  t.ok(busObsOk, 'should export BusObs type')
})

test('mod export from & execute$', async t => {
  t.ok(mod.from, 'should export from')
  t.ok(mod.execute$, 'should export executed$')
})

test('mod export `is` (alias of isActionOf)', async t => {
  t.ok(mod.is, 'should export `is`')
})

test('mod export duck', async t => {
  t.ok(mod.duck, 'should export duck')
})

test('mod export uuid', async t => {
  t.ok(mod.uuid, 'should export uuid')
  t.ok(mod.uuid.validate(mod.uuid.v4()), 'should validate uuid.v4()')
})
