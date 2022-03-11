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
}                         from 'rxjs'
import {
  filter,
  ignoreElements,
  map,
  mergeMap,
  switchMapTo,
  takeUntil,
  tap,
}                         from 'rxjs/operators'

import * as CQRS  from '../src/mods/mod.js'

const startedEvent$ = (source$: CQRS.Bus) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.duck.actions.startedEvent)))
const stoppedEvent$ = (source$: CQRS.Bus) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.duck.actions.stoppedEvent)))

const onScan$ = (source$: CQRS.Bus) => source$.pipe(
  filter(CQRS.helpers.isActionOf(CQRS.duck.actions.scanReceivedEvent)),
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

const mapToTalkerId$ = (messageReceivedEvent: ReturnType<typeof CQRS.duck.actions.messageReceivedEvent>) => (source$: Observable<any>) =>
  of(
    CQRS.duck.actions.getMessagePayloadQuery(
      messageReceivedEvent.meta.puppetId,
      messageReceivedEvent.payload.messageId,
    ),
  ).pipe(
    CQRS.helpers.mapCommandQueryToMessage(source$)(
      CQRS.duck.actions.getMessagePayloadQuery,
      CQRS.duck.actions.messagePayloadGotMessage,
    ),
    map(message => message.payload?.fromId),
    filter(Boolean),
    tap(e => console.info(e)),
  )

const mapMessageReceivedEventToSayable$ = () => (source$: Observable<ReturnType<typeof CQRS.duck.actions.messageReceivedEvent>>) => source$.pipe(
  map(messageReceivedEvent => CQRS.duck.actions.getSayablePayloadQuery(
    messageReceivedEvent.meta.puppetId,
    messageReceivedEvent.payload.messageId,
  )),
  CQRS.helpers.mapCommandQueryToMessage(source$)(
    CQRS.duck.actions.getSayablePayloadQuery,
    CQRS.duck.actions.sayablePayloadGotMessage,
  ),
  map(message => message.payload),
  filter(Boolean),
)

function isTextSayable (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.text> { return sayable.type === PUPPET.types.Sayable.Text }

const filterTextSayable$ = (text: string) => (source$: Observable<PUPPET.payloads.Sayable>) => source$.pipe(
  filter(isTextSayable),
  filter(sayable => sayable.payload.text === text),
)

const onMessage$ = (source$: CQRS.Bus) => source$.pipe(
  filter(CQRS.helpers.isActionOf(CQRS.duck.actions.messageReceivedEvent)),
  mergeMap(messageReceivedEvent => of(messageReceivedEvent).pipe(
    /**
     * message -> sayable
     */
    mapMessageReceivedEventToSayable$(),
    /**
     * sayable -> ding
     */
    filterTextSayable$('ding'),
    /**
     * ding -> talkerId
     */
    mapToTalkerId$(messageReceivedEvent),
    /**
     * talkerId -> command
     */
    map(talkerId => CQRS.duck.actions.sendMessageCommand(
      messageReceivedEvent.meta.puppetId,
      talkerId,
      CQRS.sayables.text('dong'),
    )),
    /**
     * command -> bus$
     */
    tap(command => source$.next(command)),
  )),
)

async function cqrsWechaty () {
  const wechaty = WECHATY.WechatyBuilder.build()
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

  const main$ = startedEvent$(bus$).pipe(
    switchMapTo(
      merge(
        onScan$(bus$),
        onMessage$(bus$),
      ).pipe(
        takeUntil(stoppedEvent$(bus$)),
      ),
    ),
    ignoreElements(),
  )

  /**
   * Enable logging all bus events to console
   */
  bus$.subscribe(event => console.info('bus$ event:', event))

  /**
   * Bootstrap the main system
   */
  main$.subscribe()

  /**
   * wechaty.start()
   */
  bus$.next(CQRS.duck.actions.startCommand(puppetId))
}

/**
 * No top-level await here: for CJS compatible when building Dual-ESM-CJS module
 */
main()
  .catch(console.error)
