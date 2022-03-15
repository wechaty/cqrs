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

import type * as PUPPET   from 'wechaty-puppet'

import * as types from '../types/mod.js'

import type {
  MetaResponse,
}                     from './meta.js'

import {
  create,
}                     from './create.js'

/**
 * Internal
 */
const payloadNopCommand = (_puppetId: string)   => ({})
const payloadNopMessage = (_res: MetaResponse)  => ({})

export const nopCommand = create(
  types.NOP_COMMAND, payloadNopCommand,
  types.NOP_MESSAGE, payloadNopMessage,
)

/**
 * puppet.messageSend()
 */
const payloadSendMessageCommand = (_puppetId: string, conversationId: string, sayable: PUPPET.payloads.Sayable) => ({ conversationId, sayable })
const payloadMessageSentMessage = (res: MetaResponse & { messageId?: string })                                  => ({ messageId: res.messageId })

export const sendMessageCommand = create(
  types.SEND_MESSAGE_COMMAND,  payloadSendMessageCommand,
  types.MESSAGE_SENT_MESSAGE,  payloadMessageSentMessage,
)

/**
 * puppet.ding()
 */
const payloadDingCommand    = (_puppetId: string, data?: string)  => ({ data })
const payloadDingedMessage  = (_res: MetaResponse)                => ({})

export const dingCommand = create(
  types.DING_COMMAND,    payloadDingCommand,
  types.DINGED_MESSAGE,  payloadDingedMessage,
)

/**
 * puppet.reset()
 */
const payloadResetCommand = (_puppetId: string, data?: string)  => ({ data })
const payloadResetMessage = (_res: MetaResponse)                => ({})

export const resetCommand = create(
  types.RESET_COMMAND, payloadResetCommand,
  types.RESET_MESSAGE, payloadResetMessage,
)

/**
 * puppet.start()
 */
const payloadStartCommand    = (_puppetId: string)  => ({})
const payloadStartedMessage  = (_res: MetaResponse) => ({})

export const startCommand = create(
  types.START_COMMAND,   payloadStartCommand,
  types.STARTED_MESSAGE, payloadStartedMessage,
)

/**
 * puppet.stop()
 */
const payloadStopCommand    = (_puppetId: string)   => ({})
const payloadStoppedMessage = (_res: MetaResponse)  => ({})

export const stopCommand = create(
  types.STOP_COMMAND,    payloadStopCommand,
  types.STOPPED_MESSAGE, payloadStoppedMessage,
)
