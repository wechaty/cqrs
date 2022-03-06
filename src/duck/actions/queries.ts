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

/* eslint-disable sort-keys */

import {
  createAction,
}                         from 'typesafe-actions'

import * as types from '../types.js'

import {
  metaRequest,
  metaResponse,
  MetaResponse,
}                 from './meta.js'

/**
 * puppet.getCurrentUserId
 */
const payloadGetCurrentUserIdQuery  = (puppetId: string)  => ({ puppetId })
const payloadCurrentUserIdGotEvent  = (res: MetaResponse & { contactId?: string }) => res.contactId

export const getCurrentUserIdQuery  = createAction(types.GET_CURRENT_USER_ID_QUERY, payloadGetCurrentUserIdQuery, metaRequest)()
export const currentUserIdGotEvent  = createAction(types.CURRENT_USER_ID_GOT_EVENT, payloadCurrentUserIdGotEvent, metaResponse)()

/**
 * puppet.isLoggedIn
 */
const payloadGetIsLoggedInQuery   = (puppetId: string)  => ({ puppetId })
const payloadIsLoggedInGotEvent   = (res: MetaResponse & { isLoggedIn: boolean }) => res.isLoggedIn

export const getIsLoggedInQuery  = createAction(types.GET_IS_LOGGED_IN_QUERY, payloadGetIsLoggedInQuery, metaRequest)()
export const isLoggedInGotEvent  = createAction(types.IS_LOGGED_IN_GOT_EVENT, payloadIsLoggedInGotEvent, metaResponse)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
// const nop = createAction(types.NOP)()
