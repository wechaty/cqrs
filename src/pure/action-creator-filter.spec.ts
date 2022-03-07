#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
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
import { test } from 'tstest'

import * as Duck from '../duck/mod.js'

import * as filterActionCreator from './action-creator-filter.js'

test('filter action creator smoke testing', async t => {
  const fixtures = [
    [Duck.actions.sendMessageCommand, 1,  0,  0,  0],
    [Duck.actions.startedEvent,       0,  1,  0,  0],
    [Duck.actions.messageSentMessage, 0,  0,  1,  0],
    [Duck.actions.getIsLoggedInQuery, 0,  0,  0,  1],
  ] as const

  for (const [creator, ...expected] of fixtures) {
    const isCommand = filterActionCreator.isCommand(creator)
    const isEvent   = filterActionCreator.isEvent(creator)
    const isMessage = filterActionCreator.isMessage(creator)
    const isQuery   = filterActionCreator.isQuery(creator)

    t.same([isCommand, isEvent, isMessage, isQuery], expected, `should match ${creator.name} to ${expected}`)
  }
})
