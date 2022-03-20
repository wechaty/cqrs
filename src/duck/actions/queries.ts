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

import * as types             from '../types/mod.js'
import type { MetaResponse }  from '../../cqr-event/meta.js'
import { createWithResponse } from '../../cqr-event/response-pair.js'

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
// const nop = createAction(types.NOP)()

/********************************************
 *
 * Puppet Properties
 *
 ********************************************/

const payloadGetCurrentUserIdQuery    = (_puppetId: string)                           => ({})
const payloadCurrentUserIdGotMessage  = (res: MetaResponse & { contactId?: string })  => ({ contactId: res.contactId })

/**
 * puppet.currentUserId
 */
export const getCurrentUserIdQuery = createWithResponse(
  types.GET_CURRENT_USER_ID_QUERY,
  payloadGetCurrentUserIdQuery,
  payloadCurrentUserIdGotMessage,
)

const payloadGetAuthQrCodeQuery   = (_puppetId: string)                       => ({})
const payloadAuthQrCodeGotMessage = (res: MetaResponse & { qrcode?: string }) => ({ qrcode: res.qrcode })

/**
 * puppet.authQrCode
 */
export const getAuthQrCodeQuery = createWithResponse(
  types.GET_AUTH_QR_CODE_QUERY,
  payloadGetAuthQrCodeQuery,
  payloadAuthQrCodeGotMessage,
)

const payloadGetIsLoggedInQuery   = (_puppetId: string)                             => ({})
const payloadIsLoggedInGotMessage = (res: MetaResponse & { isLoggedIn?: boolean })  => ({ isLoggedIn: res.isLoggedIn })

/**
 * puppet.isLoggedIn
 */
export const getIsLoggedInQuery = createWithResponse(
  types.GET_IS_LOGGED_IN_QUERY,
  payloadGetIsLoggedInQuery,
  payloadIsLoggedInGotMessage,
)

/********************************************
 *
 * Puppet Methods
 *
 /********************************************/

const payloadGetSayablePayloadQuery   = (_puppetId: string, sayableId: string)                      => ({ sayableId })
const payloadSayablePayloadGotMessage = (res: MetaResponse & { sayable?: PUPPET.payloads.Sayable }) => res.sayable || ({})

/**
 * puppet.sayablePayload()
 */
export const getSayablePayloadQuery = createWithResponse(
  types.GET_SAYABLE_PAYLOAD_QUERY,
  payloadGetSayablePayloadQuery,
  payloadSayablePayloadGotMessage,
)

const payloadGetMessagePayloadQuery   = (_puppetId: string, messageId: string)                      => ({ messageId })
const payloadMessagePayloadGotMessage = (res: MetaResponse & { message?: PUPPET.payloads.Message }) => res.message || ({})
/**
 * puppet.messagePayload()
 */
export const getMessagePayloadQuery = createWithResponse(
  types.GET_MESSAGE_PAYLOAD_QUERY,
  payloadGetMessagePayloadQuery,
  payloadMessagePayloadGotMessage,
)
