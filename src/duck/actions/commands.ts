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
import type * as PUPPET   from 'wechaty-puppet'

import * as types from '../types.js'

import {
  MetaResponse,
  metaRequest,
  metaResponse,
}                     from './meta.js'

/**
 * Internal
 */
const payloadNopCommand = (_puppetId: string)   => ({})
const payloadNopMessage = (_res: MetaResponse)  => ({})

export const nopCommand = createAction(types.NOP_COMMAND, payloadNopCommand,  metaRequest)()
export const nopMessage = createAction(types.NOP_MESSAGE, payloadNopMessage,  metaResponse)()

/**
 * puppet.messageSend()
 */
const payloadSendMessageCommand = (_puppetId: string, conversationId: string, sayable: PUPPET.payloads.Sayable) => ({ conversationId, sayable })
const payloadMessageSentMessage = (res: MetaResponse & { messageId?: string })                                  => ({ messageId: res.messageId })

export const sendMessageCommand = createAction(types.SEND_MESSAGE_COMMAND,  payloadSendMessageCommand,  metaRequest)()
export const messageSentMessage = createAction(types.MESSAGE_SENT_MESSAGE,  payloadMessageSentMessage,  metaResponse)()

/**
 * puppet.ding()
 */
const payloadDingCommand    = (_puppetId: string, data?: string)  => ({ data })
const payloadDingedMessage  = (_res: MetaResponse)                => ({})

export const dingCommand    = createAction(types.DING_COMMAND,    payloadDingCommand,   metaRequest)()
export const dingedMessage  = createAction(types.DINGED_MESSAGE,  payloadDingedMessage, metaResponse)()

/**
 * puppet.reset()
 */
const payloadResetCommand    = (_puppetId: string, data?: string)  => ({ data })
const payloadResetedMessage  = (_res: MetaResponse)                => ({})

export const resetCommand    = createAction(types.RESET_COMMAND,    payloadResetCommand,   metaRequest)()
export const resetedMessage  = createAction(types.RESETED_MESSAGE,  payloadResetedMessage, metaResponse)()
