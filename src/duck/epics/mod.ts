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
  isActionOf,
}               from 'typesafe-actions'
import {
  filter,
  mergeMap,
}               from 'rxjs/operators'
import type {
  Epic,
}               from 'redux-observable'

import * as actions from '../actions/mod.js'
// import * as utils   from './utils.js'

import { debug$ }         from './debug$.js'

import { authQrCode$ }      from './auth-qrcode$.js'
import { currentUserId$ }   from './current-user-id$.js'
import { ding$ }            from './ding$.js'
import { isLoggedIn$ }      from './is-logged-in$.js'
import { messagePayload$ }  from './message-payload$.js'
import { reset$ }           from './reset$.js'
import { sendMessage$ }     from './send-message$.js'
import { start$ }           from './start$.js'
import { stop$ }            from './stop$.js'

/**
 *
 * Debug for development
 *
 */
export const debugEpic: Epic = actions$ => actions$.pipe(
  mergeMap(debug$),
)

/**
 *
 * Commands
 *
 */
export const dingEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.dingCommand)),
  mergeMap(ding$),
)

export const resetEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.resetCommand)),
  mergeMap(reset$),
)

export const sendMessageEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.sendMessageCommand)),
  mergeMap(sendMessage$),
)

export const starEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.startCommand)),
  mergeMap(start$),
)

export const stopEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.stopCommand)),
  mergeMap(stop$),
)

/**
 *
 * Queries
 *
 */
export const authQrCodeEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.getAuthQrCodeQuery)),
  mergeMap(authQrCode$),
)

export const currentUserIdEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.getCurrentUserIdQuery)),
  mergeMap(currentUserId$),
)

export const isLoggedInEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.getIsLoggedInQuery)),
  mergeMap(isLoggedIn$),
)

export const messagePayloadEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.getMessagePayloadQuery)),
  mergeMap(messagePayload$),
)
