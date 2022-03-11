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
import {
  test,
}                     from 'tstest'
import {
  firstValueFrom,
}                     from 'rxjs'
import {
  filter,
}                     from 'rxjs/operators'
import {
  WechatyBuilder,
}                     from 'wechaty'
import { PuppetMock } from 'wechaty-puppet-mock'

import * as CQRS from '../src/mods/mod.js'

test('integration testing', async t => {
  const puppet = new PuppetMock()
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  const startedEventFuture = firstValueFrom(bus$.pipe(
    filter(CQRS.helpers.isActionOf(CQRS.duck.actions.startedEvent)),
  ))
  bus$.next(CQRS.duck.actions.startCommand(puppet.id))
  await t.resolves(startedEventFuture, 'should get started after the start command')

  const stoppedEventFuture = firstValueFrom(bus$.pipe(
    filter(CQRS.helpers.isActionOf(CQRS.duck.actions.stoppedEvent)),
  ))
  bus$.next(CQRS.duck.actions.stopCommand(puppet.id))
  await t.resolves(stoppedEventFuture, 'should get stopped after the stopp command')
})

test('ding/dong', async t => {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  await wechaty.start()

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const command = CQRS.duck.actions.dingCommand(wechaty.puppet.id)
  bus$.next(command)

  await new Promise(setImmediate)
  t.same(eventList, [
    command,
    CQRS.duck.actions.dingedMessage(command.meta),
  ], 'should get ding/dong events')

  await wechaty.stop()
})
