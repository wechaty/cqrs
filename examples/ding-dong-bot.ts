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
import * as WECHATY             from 'wechaty'
import * as PUPPET              from 'wechaty-puppet'
import {
  of,
  merge,
  defer,
}                         from 'rxjs'
import {
  filter,
  ignoreElements,
  map,
  mergeMap,
  takeUntil,
  tap,
  finalize,
  switchMap,
}                         from 'rxjs/operators'

import * as CQRS  from '../src/mods/mod.js'
import { mapCommandQueryToMessage } from '../src/maps/mod.js'

const onScan$ = (source$: CQRS.BusObs) => CQRS.events.scanReceivedEvent$(source$).pipe(
  map(scanReceivedEvent => scanReceivedEvent.payload),
  tap(({ qrcode, status }) => {
    const statusList = [
      PUPPET.types.ScanStatus.Waiting,
      PUPPET.types.ScanStatus.Timeout,
    ]

    if (qrcode && statusList.some(s => s === status)) {
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')

      console.info('onScan: %s(%s) - %s', PUPPET.types.ScanStatus[status], status, qrcodeImageUrl)
    } else {
      console.info('onScan: %s(%s)', PUPPET.types.ScanStatus[status], status)
    }
  }),
)

const onMessage$ = (bus$: CQRS.Bus) => CQRS.events.messageReceivedEvent$(bus$).pipe(
  mergeMap(messageReceivedEvent => of(messageReceivedEvent).pipe(
    /**
     * message -> sayable
     */
    tap(e => console.info('before map', e)),
    CQRS.maps.mapMessageReceivedEventToSayable(bus$),
    tap(e => console.info('after map', e)),
    filter(Boolean),
    /**
     * sayable -> ding
     */
    filter(CQRS.sayables.isText),
    filter(sayable => sayable.payload.text === 'ding'),
    tap(e => console.info(e)),
    mergeMap(() => of(messageReceivedEvent).pipe(
      /**
       * ding -> talkerId
       */
      CQRS.maps.mapToTalkerId(bus$),
      filter(Boolean),
      tap(e => console.info(e)),
      /**
       * talkerId -> command
       */
      map(talkerId => CQRS.duck.actions.sendMessageCommand(
        messageReceivedEvent.meta.puppetId,
        talkerId,
        CQRS.sayables.text('dong'),
      )),
      tap(e => console.info(e)),
      /**
       * command -> bus$
       */
      mapCommandQueryToMessage(bus$)(
        CQRS.duck.actions.messageSentMessage,
      ),
      tap(e => console.info(e)),
    )),
  )),
)

async function cqrsWechaty () {
  const wechaty = WECHATY.WechatyBuilder.build({ name: 'ding-dong-bot' })
  await wechaty.init()

  // wechaty.on('message', m => console.info('message:', String(m)))

  const bus$ = CQRS.from(wechaty)

  return {
    bus$,
    puppetId: wechaty.puppet.id,
  }
}

async function main () {
  const {
    bus$,
    puppetId,
  }             = await cqrsWechaty()

  const onStartedEvent$ = (bus$: CQRS.Bus) => CQRS.events.startedEvent$(bus$).pipe(
    switchMap(() => merge(
      onScan$(bus$),
      onMessage$(bus$),
    ).pipe(
      takeUntil(CQRS.events.stoppedEvent$(bus$)),
    )),
  )

  const main$ = defer(() => of(CQRS.duck.actions.startCommand(puppetId))).pipe(
    mergeMap(startCommand => merge(
      onStartedEvent$(bus$),
      CQRS.execute$(bus$)(startCommand),
    )),
    ignoreElements(),
    finalize(() => bus$.next(CQRS.duck.actions.stopCommand(puppetId))),
  )

  /**
   * Enable logging all bus events to console
   */
  // bus$.subscribe(event => console.info('bus$ event:', event))

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
