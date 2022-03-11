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
  Observable,
  defer,
}                         from 'rxjs'
import {
  filter,
  ignoreElements,
  map,
  mergeMap,
  switchMapTo,
  takeUntil,
  tap,
  finalize,
}                         from 'rxjs/operators'

import * as CQRS  from '../src/mods/mod.js'

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

const filterTextSayable$ = (text: string) => (source$: Observable<PUPPET.payloads.Sayable>) => source$.pipe(
  filter(CQRS.sayables.isText),
  filter(sayable => sayable.payload.text === text),
)

const onMessage$ = (bus$: CQRS.Bus) => CQRS.events.messageReceivedEvent$(bus$).pipe(
  mergeMap(messageReceivedEvent => of(messageReceivedEvent).pipe(
    /**
     * message -> sayable
     */
    tap(e => console.info('before map', e)),
    CQRS.maps.mapMessageReceivedEventToSayable$(),
    tap(e => console.info('after map', e)),
    /**
     * sayable -> ding
     */
    filterTextSayable$('ding'),
    tap(e => console.info(e)),
    /**
     * ding -> talkerId
     */
    CQRS.maps.mapToTalkerId$(messageReceivedEvent),
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
    tap(command => bus$.next(command)),
  )),
)

async function cqrsWechaty () {
  const wechaty = WECHATY.WechatyBuilder.build({ name: 'ding-dong-bot' })
  await wechaty.init()

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
    switchMapTo(
      merge(
        onScan$(bus$),
        onMessage$(bus$),
      ).pipe(
        takeUntil(CQRS.events.stoppedEvent$(bus$)),
      ),
    ),
  )

  const main$ = defer(() => of(CQRS.duck.actions.startCommand(puppetId))).pipe(
    mergeMap(startCommand => merge(
      CQRS.execute$(bus$)(startCommand),
      onStartedEvent$(bus$),
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
