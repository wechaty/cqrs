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
  mapTo,
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

import * as CQRS    from '../src/mods/mod.js'

function isTextSayable (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.text> { return sayable.type === PUPPET.types.Sayable.Text }

async function main () {
  const wechaty = WECHATY.WechatyBuilder.build()

  /**
   * Warm-up puppet: the `wechaty.puppet` will not exist before the first time of wechaty start
   *  because it is designed with lazy instanciation.
   *
   *  we need to start wechaty instance for once before we can use `wechaty.puppet.id`
   *
   * (an exception is that if we pass a `puppet` instance when build wechaty then it will be set out-of-the-box)
   *
   * Huan(202203): maybe a `await wechaty.init()` should be implemented for this use case.
   */
  await wechaty.start()
  await wechaty.stop()

  const bus$ = CQRS.from(wechaty)

  const startedEvent$         = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.duck.actions.startedEvent)))
  const stoppedEvent$         = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.duck.actions.stoppedEvent)))
  const messageReceivedEvent$ = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.duck.actions.messageReceivedEvent)))

  const main$ = startedEvent$(bus$).pipe(
    /**
     * start -> message
     */
    switchMapTo(messageReceivedEvent$(bus$).pipe(
      mergeMap(messageReceivedEvent => of(messageReceivedEvent).pipe(
        /**
         * message -> sayable
         */
        map(event => CQRS.duck.actions.getSayablePayloadQuery(event.meta.puppetId, event.payload.messageId)),
        CQRS.helpers.mapCommandQueryToMessage(bus$)(
          CQRS.duck.actions.getSayablePayloadQuery,
          CQRS.duck.actions.sayablePayloadGotMessage,
        ),
        map(message => message.payload),
        filter(Boolean),

        /**
         * sayable -> ding
         */
        filter(isTextSayable),
        filter(sayable => sayable.payload.text === 'ding'),

        mergeMap(sayable => of(sayable).pipe(
          /**
           * ding -> talkerId
           */
          mapTo(CQRS.duck.actions.getMessagePayloadQuery(messageReceivedEvent.meta.puppetId, messageReceivedEvent.payload.messageId)),
          CQRS.helpers.mapCommandQueryToMessage(bus$)(
            CQRS.duck.actions.getMessagePayloadQuery,
            CQRS.duck.actions.messagePayloadGotMessage,
          ),
          map(message => message.payload?.fromId),
          filter(Boolean),

          /**
           * talkerId -> command
           */
          map(talkerId => CQRS.duck.actions.sendMessageCommand(
            messageReceivedEvent.meta.puppetId,
            talkerId,
            CQRS.sayables.text('dong'),
          )),
        )),

        /**
         * command -> bus$
         */
        tap(command => bus$.next(command)),
      )),

      takeUntil(stoppedEvent$(bus$)),
    )),
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
  bus$.next(CQRS.duck.actions.startCommand(wechaty.puppet.id))
}

/**
 * No top-level await here: for CJS compatible when building Dual-ESM-CJS module
 */
main()
  .catch(console.error)
