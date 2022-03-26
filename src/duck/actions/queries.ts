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
import { metaRequest, metaResponse, MetaResponse }  from '../../cqr-event/meta.js'
import { createAction } from 'typesafe-actions'

/********************************************
 *
 * Puppet Properties
 *
 ********************************************/

/**
 * puppet.currentUserId
 */
const payloadGetCurrentUserIdQuery          = (_puppetId: string)                           => ({})
const payloadGetCurrentUserIdQueryResponse  = (res: MetaResponse & { contactId?: string })  => ({ contactId: res.contactId })

export const getCurrentUserIdQuery          = createAction(types.GET_CURRENT_USER_ID_QUERY,           payloadGetCurrentUserIdQuery,         metaRequest)()
export const getCurrentUserIdQueryResponse  = createAction(types.GET_CURRENT_USER_ID_QUERY_RESPONSE,  payloadGetCurrentUserIdQueryResponse, metaResponse)()

/**
 * puppet.authQrCode
 */
const payloadGetAuthQrCodeQuery         = (_puppetId: string)                       => ({})
const payloadGetAuthQrCodeQueryResponse = (res: MetaResponse & { qrcode?: string }) => ({ qrcode: res.qrcode })

export const getAuthQrCodeQuery         = createAction(types.GET_AUTH_QR_CODE_QUERY,          payloadGetAuthQrCodeQuery,          metaRequest)()
export const getAuthQrCodeQueryResponse = createAction(types.GET_AUTH_QR_CODE_QUERY_RESPONSE, payloadGetAuthQrCodeQueryResponse,  metaResponse)()

/**
 * puppet.isLoggedIn
 */
const payloadGetIsLoggedInQuery         = (_puppetId: string)                             => ({})
const payloadGetIsLoggedInQueryResponse = (res: MetaResponse & { isLoggedIn?: boolean })  => ({ isLoggedIn: res.isLoggedIn })

export const getIsLoggedInQuery         = createAction(types.GET_IS_LOGGED_IN_QUERY,          payloadGetIsLoggedInQuery,          metaRequest)()
export const getIsLoggedInQueryResponse = createAction(types.GET_IS_LOGGED_IN_QUERY_RESPONSE, payloadGetIsLoggedInQueryResponse,  metaResponse)()

/********************************************
 *
 * Puppet Methods
 *
 /********************************************/

/**
 * puppet.sayablePayload()
 */
const payloadGetSayablePayloadQuery         = (_puppetId: string, sayableId: string)                      => ({ sayableId })
const payloadGetSayablePayloadQueryResponse = (res: MetaResponse & { sayable?: PUPPET.payloads.Sayable }) => ({ sayable: res.sayable })

export const getSayablePayloadQuery         = createAction(types.GET_SAYABLE_PAYLOAD_QUERY,           payloadGetSayablePayloadQuery,          metaRequest)()
export const getSayablePayloadQueryResponse = createAction(types.GET_SAYABLE_PAYLOAD_QUERY_RESPONSE,  payloadGetSayablePayloadQueryResponse,  metaResponse)()

/**
 * puppet.messagePayload()
 */
const payloadGetMessagePayloadQuery         = (_puppetId: string, messageId: string)                      => ({ messageId })
const payloadGetMessagePayloadQueryResponse = (res: MetaResponse & { message?: PUPPET.payloads.Message }) => ({ message: res.message })

export const getMessagePayloadQuery         = createAction(types.GET_MESSAGE_PAYLOAD_QUERY,           payloadGetMessagePayloadQuery,          metaRequest)()
export const getMessagePayloadQueryResponse = createAction(types.GET_MESSAGE_PAYLOAD_QUERY_RESPONSE,  payloadGetMessagePayloadQueryResponse,  metaResponse)()
