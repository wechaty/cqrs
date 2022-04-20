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
import * as CQRS            from 'wechaty-cqrs'

import { WechatyBuilder }   from 'wechaty'
import { firstValueFrom }   from 'rxjs'
import { filter, take }     from 'rxjs/operators'
import assert               from 'assert'

async function main () {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })

  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const future = firstValueFrom(bus$.pipe(
    filter(CQRS.is(CQRS.events.DONG_RECEIVED_EVENT)),
    take(1),
  ))

  const command = CQRS.commands.DingCommand(wechaty.puppet.id, 'ding-data')
  bus$.next(command)

  await future

  assert.deepEqual(
    JSON.parse(JSON.stringify(eventList)),
    [
      JSON.parse(JSON.stringify(
        command,
      )),
      JSON.parse(JSON.stringify(
        CQRS.responses.DingCommandResponse(command.meta),
      )),
      JSON.parse(JSON.stringify(
        CQRS.events.DongReceivedEvent(command.meta.puppetId, { data: command.payload.data }),
      )),
    ],
    'should get DingCommand & DingedMessage & DingReceivedEvent',
  )

  assert.notEqual(CQRS.VERSION, '0.0.0', 'version should be set before publishing')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
