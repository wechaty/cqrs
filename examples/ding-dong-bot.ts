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
import * as WECHATY   from 'wechaty'
import * as PUPPET    from 'wechaty-puppet'
import {
  Observable,
  of,
  mapTo,
}                         from 'rxjs'
import {
  catchError,
  filter,
  ignoreElements,
  map,
  mergeMap,
  mergeMapTo,
  take,
  takeUntil,
  tap,
  timeout,
}                         from 'rxjs/operators'
import PuppetMock         from 'wechaty-puppet-mock'
import * as TimeConstants from 'time-constants'

import * as CQRS    from '../src/mods/mod.js'

const mapGetSayablePayloadQueryToMessage: (
  bus$: Observable<any>,
) => (
  source$: Observable<ReturnType<typeof CQRS.Duck.actions.getSayablePayloadQuery>>,
) => Observable<ReturnType<typeof CQRS.Duck.actions.sayablePayloadGotMessage>> = bus$ => source$ => source$.pipe(
  mergeMap(query => bus$.pipe(
    filter(CQRS.helpers.isActionOf(CQRS.Duck.actions.sayablePayloadGotMessage)),
    filter(message => message.meta.id === query.meta.id),
    timeout(5 * TimeConstants.SECOND),
    catchError(err => of(
      CQRS.Duck.actions.sayablePayloadGotMessage({
        gerror   : JSON.stringify(err),
        id       : query.meta.id,
        puppetId : query.meta.puppetId,
      }),
    )),
  )),
  take(1),
)

const mapGetMessagePayloadQueryToMessage: (
  bus$: Observable<any>
) => (
  source$: Observable<ReturnType<typeof CQRS.Duck.actions.getMessagePayloadQuery>>,
) => Observable<ReturnType<typeof CQRS.Duck.actions.messagePayloadGotMessage>> = bus$ => source$ => source$.pipe(
  mergeMap(query => bus$.pipe(
    filter(CQRS.helpers.isActionOf(CQRS.Duck.actions.messagePayloadGotMessage)),
    filter(message => message.meta.id === query.meta.id),
    timeout(5 * TimeConstants.SECOND),
    catchError(err => of(
      CQRS.Duck.actions.messagePayloadGotMessage({
        gerror   : JSON.stringify(err),
        id       : query.meta.id,
        puppetId : query.meta.puppetId,
      }),
    )),
  )),
  take(1),
)

function isTextSayable (sayable: PUPPET.payloads.Sayable): sayable is ReturnType<typeof PUPPET.payloads.sayable.text> { return sayable.type === PUPPET.types.Sayable.Text }

async function main () {
  const puppet  = new PuppetMock()
  const wechaty = WECHATY.WechatyBuilder.build({ puppet })
  const bus$    = CQRS.cqrsWechaty(wechaty)

  const startedEvent$         = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.Duck.actions.startedEvent)))
  const stoppedEvent$         = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.Duck.actions.stoppedEvent)))
  const messageReceivedEvent$ = (source$: typeof bus$) => source$.pipe(filter(CQRS.helpers.isActionOf(CQRS.Duck.actions.messageReceivedEvent)))

  /**
   * wechaty.start()
   */
  const main$ = startedEvent$(bus$).pipe(
    /**
     * start -> message
     */
    mergeMapTo(messageReceivedEvent$(bus$).pipe(
      mergeMap(messageReceivedEvent => of(messageReceivedEvent).pipe(
        /**
         * message -> sayable
         */
        map(event => CQRS.Duck.actions.getSayablePayloadQuery(event.meta.puppetId, event.payload.messageId)),
        mapGetSayablePayloadQueryToMessage(bus$),
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
          mapTo(CQRS.Duck.actions.getMessagePayloadQuery(messageReceivedEvent.meta.puppetId, messageReceivedEvent.payload.messageId)),
          mapGetMessagePayloadQueryToMessage(bus$),
          map(message => message.payload?.fromId),
          filter(Boolean),

          /**
           * talkerId -> command
           */
          map(talkerId => CQRS.Duck.actions.sendMessageCommand(
            messageReceivedEvent.meta.puppetId,
            talkerId,
            CQRS.sayable.text('dong'),
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

  bus$.subscribe(event => console.info('bus$ event:', event))
  main$.subscribe()

  bus$.next(CQRS.Duck.actions.startCommand(wechaty.puppet.id))
}

main()
  .catch(console.error)
