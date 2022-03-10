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
  defer,
  of,
  lastValueFrom,
  firstValueFrom,
}                   from 'rxjs'
import {
  tap,
  startWith,
  filter,
}                   from 'rxjs/operators'
import {
  WechatyBuilder,
  Message,
}                   from 'wechaty'
import {
  Duck as ReduxDuck,
}                   from 'wechaty-redux'
import * as PUPPET  from 'wechaty-puppet'

import {
  mock,
  PuppetMock,
}                     from 'wechaty-puppet-mock'
import {
  isActionOf,
}                     from 'typesafe-actions'

import * as CqrsDuck from './duck/mod.js'

import { from } from './cqrs.js'

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
    CqrsDuck.actions.stateActivatedEvent(puppet.id, 'pending'),
    startCommand,
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
    CqrsDuck.actions.stateInactivatedEvent(puppet.id, 'pending'),
    stopCommand,
    CqrsDuck.actions.stateInactivatedEvent(puppet.id, true),
    CqrsDuck.actions.stoppedEvent(puppet.id),

  ], 'should get stop events')
})

test.only('Events - login', async t => {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  await wechaty.init()
  const bus$ = from(wechaty)

  await wechaty.start()

  const eventList: any[] = []
  bus$.subscribe(e => eventList.push(e))

  t.equal(bundle.selectors.isLoggedIn(bot.puppet.id), false, 'should not logged in at start')
  t.notOk(bundle.selectors.getQrCode(bot.puppet.id), 'should no QR Code at start')
  t.notOk(bundle.selectors.getCurrentUser(bot.puppet.id), 'should no user payload at start')

  // const QR_CODE = 'qrcode'
  // mocker.scan(QR_CODE)
  // t.equal(bundle.selectors.getQrCode(bot.puppet.id), QR_CODE, 'should get QR Code right')

  // const user = mocker.createContact()
  // mocker.login(user)

  // Let the bullets fly
  // await new Promise(resolve => setImmediate(resolve))

  // t.ok(bundle.selectors.isLoggedIn(bot.puppet.id), 'should logged in after login(user)')
  // t.notOk(bundle.selectors.getQrCode(bot.puppet.id), 'should no QR Code after user login')
  // t.same(bundle.selectors.getCurrentUser(bot.puppet.id), { ...user.payload, puppetId: bot.puppet.id }, 'should login user with payload')

  // await wechaty.logout()
  // await wechaty.stop()

  // t.notOk(bundle.selectors.isLoggedIn(bot.puppet.id), 'should logged out after call bot.logout')

  const EXPECTED_EVENT_LIST = [
    ReduxDuck.actions.registerWechatyCommand(wechaty.id),
    ReduxDuck.actions.registerPuppetCommand(wechaty.puppet.id),
    ReduxDuck.actions.bindWechatyPuppetCommand({ puppetId: wechaty.puppet.id, wechatyId: wechaty.id }),
    CqrsDuck.actions.stateActivatedEvent(wechaty.puppet.id, 'pending'),
    CqrsDuck.actions.stateActivatedEvent(wechaty.puppet.id, true),
    CqrsDuck.actions.startedEvent(wechaty.puppet.id),
    CqrsDuck.actions.loginReceivedEvent(wechaty.puppet.id, { contactId: user.id }),
    CqrsDuck.actions.logoutReceivedEvent(wechaty.puppet.id, { contactId: user.id, data: 'logout()' }),
    CqrsDuck.actions.stateInactivatedEvent(wechaty.puppet.id, 'pending'),
    CqrsDuck.actions.stateInactivatedEvent(wechaty.puppet.id, true),
    CqrsDuck.actions.stoppedEvent(wechaty.puppet.id),
  ]

  t.same(eventList, EXPECTED_EVENT_LIST, 'should get wechaty event list')
})
// test('WechatyRedux: operations.ding()', async t => {
//   for await (const {
//     bot,
//     bundle: duck,
//   } of wechatyFixtures()) {

//     const DATA = 'test'

//     const sandbox = sinon.createSandbox()
//     const spy = sandbox.spy(bot.puppet, 'ding')

//     duck.operations.ding(bot.puppet.id, DATA)

//     // Let the bullets fly
//     await new Promise(setImmediate)

//     t.ok(spy.calledOnce, 'should call bot.ding()')
//     t.ok(spy.calledWith(DATA), 'should called with DATA')
//   }
// })

// test('WechatyRedux: operations.say()', async t => {
//   for await (const {
//     bot,
//     bundle: duck,
//     mocker,
//   } of wechatyFixtures()) {

//     const TEXT = 'Hello, world.'

//     const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
//     mocker.login(user)

//     const sandbox = sinon.createSandbox()
//     const spy = sandbox.spy(bot.puppet, 'messageSendText')

//     const EXPECTED_ARGS = [
//       mary.id,
//       TEXT,
//     ]
//     duck.operations.say(bot.puppet.id, mary.id, PUPPET.payloads.sayable.text(TEXT, []))

//     // Let the bullets fly
//     await new Promise(resolve => setImmediate(resolve))

//     t.ok(spy.calledOnce, 'should call bot.say()')
//     t.ok(spy.calledWith(...EXPECTED_ARGS), 'should call say() with expected args')
//   }
// })

// test('WechatyRedux: Puppet `message` event', async t => {
//   for await (const {
//     bot,
//     mocker,
//   } of wechatyFixtures()) {

//     const TEXT = 'Hello, world.'

//     const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
//     mocker.login(user)

//     const future = new Promise<Message>(resolve => bot.once('message', resolve))

//     mary.say(TEXT).to(user)

//     const msg = await future

//     const EXPECTED_PAYLOAD: PUPPET.payloads.Message = {
//       fromId        : mary.id,
//       id            : msg.id,
//       mentionIdList : [],
//       text          : TEXT,
//       timestamp     : msg.date().getTime(),
//       toId          : user.id,
//       type          : PUPPET.types.Message.Text,

//     }

//     // Huan(202006) Workaround for puppet payload mismatch
//     delete (EXPECTED_PAYLOAD as any).mentionIdList

//     t.same(msg.payload, EXPECTED_PAYLOAD, 'should receive message with expected payload')
//   }
// })

// test('WechatyRedux: getPuppet() & getWechaty()', async t => {
//   const puppet = new PuppetMock()
//   const wechaty = WechatyBuilder.build({ puppet })

//   const spy = sinon.spy()
//   const store = {
//     dispatch: spy,
//   }

//   t.notOk(getWechaty(wechaty.id), 'should has no wechaty registered')
//   t.notOk(getPuppet(puppet.id), 'should has no puppet registered')

//   wechaty.use(WechatyRedux({ store } as any))
//   t.notOk(getWechaty(wechaty.id), 'should has no wechaty registered after use plugin but before wechaty start')
//   t.notOk(getPuppet(puppet.id), 'should has no puppet registered after use plugin but before wechaty start')

//   await wechaty.start()

//   t.equal(getWechaty(wechaty.id), wechaty, 'should has wechaty registered after use plugin & wechaty start')
//   t.equal(getPuppet(puppet.id), puppet, 'should has puppet registered after wechaty start')

//   t.equal(spy.callCount, 6, 'should have 6 actions from wechaty start()')
//   t.same(spy.args[0]![0], CqrsDuck.actions.registerWechatyCommand(wechaty.id), 'should emit register wechaty action')
//   t.same(spy.args[1]![0], CqrsDuck.actions.registerPuppetCommand(puppet.id), 'should emit register puppet action')
//   t.same(spy.args[2]![0], CqrsDuck.actions.bindWechatyPuppetCommand({ puppetId: puppet.id, wechatyId: wechaty.id }), 'should emit bind wechaty puppet action')
//   t.same(spy.args[3]![0], CqrsDuck.actions.stateActivatedEvent(puppet.id, 'pending'), 'should emit state active action')
//   t.same(spy.args[4]![0], CqrsDuck.actions.stateActivatedEvent(puppet.id, true), 'should emit state inactive action')
//   t.same(spy.args[5]![0], CqrsDuck.actions.startedEvent(puppet.id), 'should emit start event action')

//   spy.resetHistory()
//   await wechaty.stop()

//   t.equal(spy.callCount, 3, 'should have 3 actions from wechaty stop()')
//   t.same(spy.args[0]![0], CqrsDuck.actions.stateInactivatedEvent(puppet.id, 'pending'), 'should emit state inactive action')
//   t.same(spy.args[1]![0], CqrsDuck.actions.stateInactivatedEvent(puppet.id, true), 'should emit state ininactive action')
//   t.same(spy.args[2]![0], CqrsDuck.actions.stoppedEvent(puppet.id), 'should emit stop event action')
// })
