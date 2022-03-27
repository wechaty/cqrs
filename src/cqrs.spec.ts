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
  sinon,
}                   from 'tstest'
import {
  of,
  firstValueFrom,
}                   from 'rxjs'
import {
  filter,
  mergeMap,
}                   from 'rxjs/operators'
import {
  WechatyBuilder,
}                   from 'wechaty'
import * as PUPPET  from 'wechaty-puppet'

import {
  mock,
  PuppetMock,
}                     from 'wechaty-puppet-mock'
import {
  isActionOf,
}                     from 'typesafe-actions'

/**
 * Initialize the classified actions
 */
import './classified/mod.js'

import * as CqrsDuck    from './duck/mod.js'
import * as sayables    from './mods/sayables.js'
import { execute$ }     from './execute$/mod.js'

import { from }       from './cqrs.js'

test('smoke testing', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  await wechaty.start()

  const user = mocker.createContact()
  mocker.login(user)

  // Let the bullets fly
  await new Promise(resolve => setImmediate(resolve))

  await wechaty.logout()
  await wechaty.stop()

  /**
   * Huan(202203): we are using `JSON.parse` & `JSON.stringify`
   *  to match the class instances & plain objects
   */
  t.same(
    JSON.parse(JSON.stringify(eventList)),
    JSON.parse(JSON.stringify([
      // ReduxDuck.actions.registerWechatyCommand(wechaty.id),
      // ReduxDuck.actions.registerPuppetCommand(wechaty.puppet.id),
      // ReduxDuck.actions.bindWechatyPuppetCommand({ puppetId: wechaty.puppet.id, wechatyId: wechaty.id }),
      CqrsDuck.actions.stateActivatedEvent(wechaty.puppet.id, 'pending'),
      CqrsDuck.actions.stateActivatedEvent(wechaty.puppet.id, true),
      CqrsDuck.actions.startedEvent(wechaty.puppet.id),
      CqrsDuck.actions.loginReceivedEvent(wechaty.puppet.id, { contactId: user.id }),
      CqrsDuck.actions.logoutReceivedEvent(wechaty.puppet.id, { contactId: user.id, data: 'logout()' }),
      CqrsDuck.actions.stateInactivatedEvent(wechaty.puppet.id, 'pending'),
      CqrsDuck.actions.stateInactivatedEvent(wechaty.puppet.id, true),
      CqrsDuck.actions.stoppedEvent(wechaty.puppet.id),
    ])),
    'should get wechaty event list',
  )
})

test('bus$.next(e) -> bus$.subscribe(e)', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const testCommand = CqrsDuck.actions.dingCommand(puppet.id, 'test')
  bus$.next(testCommand)

  t.same(
    JSON.parse(JSON.stringify(
      eventList.filter(
        isActionOf(CqrsDuck.actions.dingCommand),
      ),
    )),
    JSON.parse(JSON.stringify([
      testCommand,
    ])),
    'should received the event from bus$ as same as the next()-ed one to bus$',
  )
})

test('Command/Event - ding/dong', async t => {
  const DING_DATA = 'ding-data'

  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  await wechaty.start()

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const futureDong = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.dongReceivedEvent)),
  ))

  const dingCommand = CqrsDuck.actions.dingCommand(puppet.id, DING_DATA)
  bus$.next(dingCommand)
  await futureDong

  t.same(
    JSON.parse(JSON.stringify(eventList)),
    JSON.parse(JSON.stringify([
      dingCommand,
      CqrsDuck.actions.dingCommandResponse({ id: dingCommand.meta.id, puppetId: puppet.id }),
      CqrsDuck.actions.dongReceivedEvent(puppet.id, { data: DING_DATA }),
    ])),
    'should get dong event with data',
  )

  await wechaty.stop()
})

test('Commands - start/stop', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const startFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.startedEvent)),
  ))

  const startCommand = CqrsDuck.actions.startCommand(puppet.id)
  bus$.next(startCommand)

  await startFuture
  t.same(
    JSON.parse(JSON.stringify(eventList)),
    JSON.parse(JSON.stringify([
      startCommand,
      CqrsDuck.actions.stateActivatedEvent(puppet.id, 'pending'),
      CqrsDuck.actions.startCommandResponse(startCommand.meta),
      CqrsDuck.actions.stateActivatedEvent(puppet.id, true),
      CqrsDuck.actions.startedEvent(puppet.id),
    ])),
    'should get start events',
  )

  const stopFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.stoppedEvent)),
  ))
  const stopCommand = CqrsDuck.actions.stopCommand(puppet.id)
  eventList.length = 0
  bus$.next(stopCommand)

  await stopFuture
  t.same(
    JSON.parse(JSON.stringify(eventList)),
    JSON.parse(JSON.stringify([
      stopCommand,
      CqrsDuck.actions.stateInactivatedEvent(puppet.id, 'pending'),
      CqrsDuck.actions.stopCommandResponse(stopCommand.meta),
      CqrsDuck.actions.stateInactivatedEvent(puppet.id, true),
      CqrsDuck.actions.stoppedEvent(puppet.id),
    ])),
    'should get stop events',
  )
})

test('Events - not logged in', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const startCommand = CqrsDuck.actions.startCommand(puppet.id)
  bus$.next(startCommand)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  /**
   * getCurrentUserIdQuery
   */
  const currentUserIdMessage = await firstValueFrom(
    of(CqrsDuck.actions.getCurrentUserIdQuery(puppet.id)).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.notOk(currentUserIdMessage.payload.contactId, 'should have no currentUserId right after start')

  /**
   * getIsLoggedInQuery
   */
  const isLoggedIn = await firstValueFrom(
    of(CqrsDuck.actions.getIsLoggedInQuery(puppet.id)).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.equal(isLoggedIn.payload.isLoggedIn, false, 'should have not logged in right after start')

  /**
   * getAuthQrCodeQuery
   */
  const qrCodeMessage = await firstValueFrom(
    of(
      CqrsDuck.actions.getAuthQrCodeQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.notOk(qrCodeMessage.payload.qrcode, 'should have no qrcode right after start')

  const stopCommand = CqrsDuck.actions.stopCommand(puppet.id)
  bus$.next(stopCommand)
})

test('Events - logged in', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const startCommand = CqrsDuck.actions.startCommand(puppet.id)
  bus$.next(startCommand)

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const authQrCodeGotMessage0 = await firstValueFrom(
    of(
      CqrsDuck.actions.getAuthQrCodeQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.notOk(authQrCodeGotMessage0.payload.qrcode, 'should have no qr code right after start')

  /**
   * getAuthQrCodeQuery
   */
  const QR_CODE = 'qrcode'
  mocker.scan(QR_CODE)

  const authQrCodeGotMessage = await firstValueFrom(
    of(
      CqrsDuck.actions.getAuthQrCodeQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.equal(authQrCodeGotMessage.payload.qrcode, QR_CODE, 'should get qr code')

  /**
   * getCurrentUserIdQuery
   */
  const user = mocker.createContact()
  mocker.login(user)

  // Let the bullets fly
  await new Promise(resolve => setImmediate(resolve))

  const currentUserIdMessage = await firstValueFrom(
    of(
      CqrsDuck.actions.getCurrentUserIdQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.equal(currentUserIdMessage.payload.contactId, user.id, 'should get the logged in user')

  /**
   * getIsLoggedInQuery
   */
  const isLoggedIn = await firstValueFrom(
    of(
      CqrsDuck.actions.getIsLoggedInQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.ok(isLoggedIn.payload.isLoggedIn, 'should logged in')

  /**
   * QR Code cleaned after login
   */
  const authQrCodeGotMessage2 = await firstValueFrom(
    of(
      CqrsDuck.actions.getAuthQrCodeQuery(puppet.id),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.notOk(authQrCodeGotMessage2.payload.qrcode, 'should clean qrcode after logged in')

  const stopCommand = CqrsDuck.actions.stopCommand(puppet.id)
  bus$.next(stopCommand)
})

test('sendMessageCommand', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const startedEventFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.startedEvent)),
  ))
  bus$.next(CqrsDuck.actions.startCommand(puppet.id))
  await startedEventFuture

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const TEXT = 'Hello, world.'

  const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
  mocker.login(user)

  const sandbox = sinon.createSandbox()
  const spy = sandbox.spy(wechaty.puppet, 'messageSendText')

  const EXPECTED_ARGS = [
    mary.id,
    TEXT,
  ]

  const message = await firstValueFrom(
    of(
      CqrsDuck.actions.sendMessageCommand(puppet.id, mary.id, sayables.text(TEXT)),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )
  t.notOk(message.meta.gerror, 'should get no error')

  t.ok(spy.calledOnce, 'should call messageSentText()')
  t.ok(spy.calledWith(...EXPECTED_ARGS), 'should call messageSentText() with expected args')

  const stopCommand = CqrsDuck.actions.stopCommand(puppet.id)
  bus$.next(stopCommand)
})

test('MessageReceivedEvent', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  const startedEventFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.startedEvent)),
  ))
  bus$.next(CqrsDuck.actions.startCommand(puppet.id))
  await startedEventFuture

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  const TEXT = 'Hello, world.'

  const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
  mocker.login(user)

  const messageReceivedEventFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.messageReceivedEvent)),
  ))

  mary.say(TEXT).to(user)

  const messageReceivedEvent = await messageReceivedEventFuture
  t.ok(messageReceivedEvent.payload.messageId, 'should get message event with valid messageId')

  const messagePayloadMessage = await firstValueFrom(
    of(
      CqrsDuck.actions.getMessagePayloadQuery(puppet.id, messageReceivedEvent.payload.messageId),
    ).pipe(
      mergeMap(execute$(bus$)),
    ),
  )

  const EXPECTED_PAYLOAD: PUPPET.payloads.Message = {
    id            : messagePayloadMessage.payload.message!.id,
    listenerId    : user.id,
    talkerId      : mary.id,
    text          : TEXT,
    timestamp     : messagePayloadMessage.payload.message?.timestamp ?? -1,
    type          : PUPPET.types.Message.Text,
  }

  t.same(messagePayloadMessage.payload, { message: EXPECTED_PAYLOAD }, 'should receive message with expected payload')
})
