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
import * as WECHATY from 'wechaty'
import * as PUPPET  from 'wechaty-puppet'
import {
  merge,
  defer,
}                   from 'rxjs'
import {
  map,
  mergeMap,
  tap,
  finalize,
}                   from 'rxjs/operators'

import * as CQRS    from '../src/mods/mod.js'

const onScan$ = (source$: CQRS.BusObs) => CQRS.events$.scanReceivedEvent$(source$).pipe(
  map(scanReceivedEvent => scanReceivedEvent.payload),
  tap(({ qrcode, status }) => console.info('onScan$: %s(%s) %s', PUPPET.types.ScanStatus[status], status, qrcode
    ? `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
    : '',
  )),
)

const onMessage$ = (bus$: CQRS.Bus) => CQRS.events$.messageReceivedEvent$(bus$).pipe(
  map(messageReceivedEvent => CQRS.duck.actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  mergeMap(CQRS.execute$(bus$)(CQRS.duck.actions.getSayablePayloadQuery)),
  map(sayablePayloadGotMessage => sayablePayloadGotMessage.payload),
  tap(sayable => console.info('onMessage$:', sayable)),
)

async function main () {
  const wechaty = WECHATY.WechatyBuilder.build({ name: 'ding-dong-bot' })
  await wechaty.init()
  const bus$ = CQRS.from(wechaty)

  /**
   * Start/stop Wechaty when subscribing/unsubscribing
   */
  const onSubscribe$  = () => defer(()    => CQRS.execute$(bus$)(CQRS.duck.actions.startCommand)(CQRS.duck.actions.startCommand(wechaty.puppet.id)))
  const onUnsubscribe = () => finalize(() => bus$.next(CQRS.duck.actions.stopCommand(wechaty.puppet.id)))

  const handlers$ = (bus$: CQRS.Bus) => merge(
    onScan$(bus$),
    onMessage$(bus$),
  )

  const main$ = merge(
    handlers$(bus$),
    onSubscribe$(),
  ).pipe(
    onUnsubscribe(),
  )

  /**
  * Enable logging all bus events to console
  */
  bus$.subscribe(event => console.info('CQRS Wechaty bus$ event:', event))

  /**
  * Bootstrap the main system
  */
  main$.subscribe()
}

/**
* No top-level await here: for CJS compatible when building Dual-ESM-CJS module
*/
main()
  .catch(console.error)
