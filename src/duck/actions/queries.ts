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

import type * as PUPPET   from 'wechaty-puppet'

import * as types from '../types/mod.js'

import type {
  MetaResponse,
}                 from './meta.js'

import {
  create,
}           from './create.js'

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
// const nop = createAction(types.NOP)()

/**
 * puppet.getCurrentUserId
 */
const payloadGetCurrentUserIdQuery    = (_puppetId: string)                           => ({})
const payloadCurrentUserIdGotMessage  = (res: MetaResponse & { contactId?: string })  => ({ contactId: res.contactId })

export const getCurrentUserIdQuery = create(
  types.GET_CURRENT_USER_ID_QUERY,   payloadGetCurrentUserIdQuery,
  types.CURRENT_USER_ID_GOT_MESSAGE, payloadCurrentUserIdGotMessage,
)

/**
 * puppet.isLoggedIn
 */
const payloadGetIsLoggedInQuery   = (_puppetId: string)                             => ({})
const payloadIsLoggedInGotMessage = (res: MetaResponse & { isLoggedIn?: boolean })  => ({ isLoggedIn: res.isLoggedIn })

export const getIsLoggedInQuery = create(
  types.GET_IS_LOGGED_IN_QUERY,    payloadGetIsLoggedInQuery,
  types.IS_LOGGED_IN_GOT_MESSAGE,  payloadIsLoggedInGotMessage,
)

/**
 * puppet.sayablePayload
 */
const payloadGetSayablePayloadQuery   = (_puppetId: string, sayableId: string)                      => ({ sayableId })
const payloadSayablePayloadGotMessage = (res: MetaResponse & { sayable?: PUPPET.payloads.Sayable }) => res.sayable || ({})

export const getSayablePayloadQuery = create(
  types.GET_SAYABLE_PAYLOAD_QUERY,    payloadGetSayablePayloadQuery,
  types.SAYABLE_PAYLOAD_GOT_MESSAGE,  payloadSayablePayloadGotMessage,
)

/**
 * puppet.messagePayload
 */
const payloadGetMessagePayloadQuery   = (_puppetId: string, messageId: string)                      => ({ messageId })
const payloadMessagePayloadGotMessage = (res: MetaResponse & { message?: PUPPET.payloads.Message }) => res.message || ({})

export const getMessagePayloadQuery = create(
  types.GET_MESSAGE_PAYLOAD_QUERY,    payloadGetMessagePayloadQuery,
  types.MESSAGE_PAYLOAD_GOT_MESSAGE,  payloadMessagePayloadGotMessage,
)

/**
 * puppet.qrCode
 */
const payloadGetAuthQrCodeQuery   = (_puppetId: string)                       => ({})
const payloadAuthQrCodeGotMessage = (res: MetaResponse & { qrcode?: string }) => ({ qrcode: res.qrcode })

export const getAuthQrCodeQuery = create(
  types.GET_AUTH_QR_CODE_QUERY,    payloadGetAuthQrCodeQuery,
  types.AUTH_QR_CODE_GOT_MESSAGE,  payloadAuthQrCodeGotMessage,
)
