#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
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
import * as CQRS          from 'wechaty-cqrs'
import { WechatyBuilder } from 'wechaty'
import assert from 'assert'

async function main () {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })

  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  bus$.next(CQRS.duck.actions.dingCommand(wechaty.puppet.id))
  await new Promise(setImmediate)

  console.info(eventList)

  assert(eventList.length > 0, 'should emit events via bus$')
  assert(CQRS.VERSION !== '0.0.0', 'version should be set before publishing')
}

main()
  .catch(console.error)
