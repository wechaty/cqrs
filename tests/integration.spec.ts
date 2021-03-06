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
import { test }             from 'tstest'
import { firstValueFrom }   from 'rxjs'
import { filter, take }     from 'rxjs/operators'
import { WechatyBuilder }   from 'wechaty'

import * as CQRS from '../src/mods/mod.js'

test('integration testing', async t => {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })

  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  const startedEventFuture = firstValueFrom(bus$.pipe(
    filter(CQRS.is(CQRS.events.StartedEvent)),
  ))
  bus$.next(CQRS.commands.StartCommand(wechaty.puppet.id))
  await t.resolves(startedEventFuture, 'should get started after the start command')

  const stoppedEventFuture = firstValueFrom(bus$.pipe(
    filter(CQRS.is(CQRS.events.StoppedEvent)),
  ))
  bus$.next(CQRS.commands.StopCommand(wechaty.puppet.id))
  await t.resolves(stoppedEventFuture, 'should get stopped after the stopp command')
})

test('ding/dong', async t => {
  const DING_DATA = 'ding-data'

  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const command = CQRS.commands.DingCommand(wechaty.puppet.id, DING_DATA)
  bus$.next(command)

  await firstValueFrom(bus$.pipe(
    filter(CQRS.is(CQRS.events.DongReceivedEvent)),
    take(1),
  ))

  t.same(eventList, [
    command,
    CQRS.responses.DingCommandResponse(command.meta),
    CQRS.events.DongReceivedEvent(command.meta.puppetId, { data: DING_DATA }),
  ], 'should get dingCommand & dingedMessage & dingReceivedEvent')
})
