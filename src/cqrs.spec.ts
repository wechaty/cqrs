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
  firstValueFrom,
}                   from 'rxjs'
import {
  filter,
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

import * as CqrsDuck  from './duck/mod.js'
import * as sayables  from './mods/sayables.js'

import { mapCommandQueryToMessage } from './maps/mod.js'

import { from }                     from './cqrs.js'

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

  t.same(eventList, [
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
  ], 'should get wechaty event list')
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

  t.same(eventList, [
    dingCommand,
    CqrsDuck.actions.dingedMessage({ id: dingCommand.meta.id, puppetId: puppet.id }),
    CqrsDuck.actions.dongReceivedEvent(puppet.id, { data: DING_DATA }),
  ], 'should get dong event with data')

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
  t.same(eventList, [
    startCommand,
    CqrsDuck.actions.stateActivatedEvent(puppet.id, 'pending'),
    CqrsDuck.actions.startedMessage(startCommand.meta),
    CqrsDuck.actions.stateActivatedEvent(puppet.id, true),
    CqrsDuck.actions.startedEvent(puppet.id),
  ], 'should get start events')

  const stopFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.stoppedEvent)),
  ))
  const stopCommand = CqrsDuck.actions.stopCommand(puppet.id)
  eventList.length = 0
  bus$.next(stopCommand)

  await stopFuture
  t.same(eventList, [
    stopCommand,
    CqrsDuck.actions.stateInactivatedEvent(puppet.id, 'pending'),
    CqrsDuck.actions.stoppedMessage(stopCommand.meta),
    CqrsDuck.actions.stateInactivatedEvent(puppet.id, true),
    CqrsDuck.actions.stoppedEvent(puppet.id),

  ], 'should get stop events')
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
  const getCurrentUserIdQuery = CqrsDuck.actions.getCurrentUserIdQuery(puppet.id)
  const currentUserIdFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
  ))

  bus$.next(getCurrentUserIdQuery)
  const currentUserIdMessage = await currentUserIdFuture
  t.notOk(currentUserIdMessage.payload.contactId, 'should not logged in at start')

  /**
   * getIsLoggedInQuery
   */
  const getIsLoggedInQuery = CqrsDuck.actions.getIsLoggedInQuery(puppet.id)
  const isLoggedInFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getIsLoggedInQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.isLoggedInGotMessage,
    ),
  ))

  bus$.next(getIsLoggedInQuery)
  const isLoggedIn = await isLoggedInFuture
  t.equal(isLoggedIn.payload.isLoggedIn, false, 'should not logged in at start')

  /**
   * getAuthQrCodeQuery
   */
  const getQrCodeQuery = CqrsDuck.actions.getAuthQrCodeQuery(puppet.id)
  const qrCodeFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getAuthQrCodeQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.authQrCodeGotMessage,
    ),
  ))

  bus$.next(getQrCodeQuery)
  const qrCodeMessage = await qrCodeFuture
  t.notOk(qrCodeMessage.payload.qrcode, 'should no qrcode at start')

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

  /**
   * getAuthQrCodeQuery
   */
  const QR_CODE = 'qrcode'
  mocker.scan(QR_CODE)

  const getQrCodeQuery = CqrsDuck.actions.getAuthQrCodeQuery(puppet.id)
  const qrCodeFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getAuthQrCodeQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.authQrCodeGotMessage,
    ),
  ))

  bus$.next(getQrCodeQuery)
  const authQrCodeGotMessage = await qrCodeFuture
  t.equal(authQrCodeGotMessage.payload.qrcode, QR_CODE, 'should get qr code')

  /**
   * getCurrentUserIdQuery
   */
  const user = mocker.createContact()
  mocker.login(user)

  // Let the bullets fly
  await new Promise(resolve => setImmediate(resolve))

  const getCurrentUserIdQuery = CqrsDuck.actions.getCurrentUserIdQuery(puppet.id)
  const currentUserIdFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getCurrentUserIdQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.currentUserIdGotMessage,
    ),
  ))

  bus$.next(getCurrentUserIdQuery)
  const currentUserIdMessage = await currentUserIdFuture
  t.equal(currentUserIdMessage.payload.contactId, user.id, 'should get the logged in user')

  /**
   * getIsLoggedInQuery
   */
  const getIsLoggedInQuery = CqrsDuck.actions.getIsLoggedInQuery(puppet.id)
  const isLoggedInFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getIsLoggedInQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.isLoggedInGotMessage,
    ),
  ))

  bus$.next(getIsLoggedInQuery)
  const isLoggedIn = await isLoggedInFuture
  t.ok(isLoggedIn.payload.isLoggedIn, 'should logged in')

  /**
   * QR Code cleaned after login
   */
  const qrCodeFutureAfterLoggedIn = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getAuthQrCodeQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.authQrCodeGotMessage,
    ),
  ))

  bus$.next(getQrCodeQuery)
  const authQrCodeGotMessage2 = await qrCodeFutureAfterLoggedIn

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

  const command = CqrsDuck.actions.sendMessageCommand(puppet.id, mary.id, sayables.text(TEXT))
  const messageFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.sendMessageCommand)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.messageSentMessage,
    ),
  ))

  bus$.next(command)
  const message = await messageFuture
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

  const getMessagePayloadQuery = CqrsDuck.actions.getMessagePayloadQuery(puppet.id, messageReceivedEvent.payload.messageId)
  const messagePayloadMessageFuture = firstValueFrom(bus$.pipe(
    filter(isActionOf(CqrsDuck.actions.getMessagePayloadQuery)),
    mapCommandQueryToMessage(bus$)(
      CqrsDuck.actions.messagePayloadGotMessage,
    ),
  ))

  bus$.next(getMessagePayloadQuery)
  const messagePayloadMessage = await messagePayloadMessageFuture

  const EXPECTED_PAYLOAD: PUPPET.payloads.Message = {
    fromId        : mary.id,
    id            : messagePayloadMessage.payload?.id ?? 'ERROR_NO_ID',
    // mentionIdList : [],
    text          : TEXT,
    timestamp     : messagePayloadMessage.payload?.timestamp ?? -1,
    toId          : user.id,
    type          : PUPPET.types.Message.Text,

  }

  // Huan(202006) Workaround for puppet payload mismatch
  // delete (EXPECTED_PAYLOAD as any).mentionIdList

  t.same(messagePayloadMessage.payload, EXPECTED_PAYLOAD, 'should receive message with expected payload')
})
