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
}                     from './meta.js'

import {
  createWithResponse,
}                     from './action-pair.js'

const payloadSendMessageCommand = (_puppetId: string, conversationId: string, sayable: PUPPET.payloads.Sayable) => ({ conversationId, sayable })
const payloadMessageSentMessage = (res: MetaResponse & { messageId?: string })                                  => ({ messageId: res.messageId })

/**
 * puppet.messageSend()
 */
export const sendMessageCommand = createWithResponse(
  types.SEND_MESSAGE_COMMAND,
  payloadSendMessageCommand,
  payloadMessageSentMessage,
)

const payloadDingCommand    = (_puppetId: string, data?: string)  => ({ data })
const payloadDingedMessage  = (_res: MetaResponse)                => ({})

/**
 * puppet.ding()
 */
export const dingCommand = createWithResponse(
  types.DING_COMMAND,
  payloadDingCommand,
  payloadDingedMessage,
)

const payloadResetCommand = (_puppetId: string, data?: string)  => ({ data })
const payloadResetMessage = (_res: MetaResponse)                => ({})

/**
 * puppet.reset()
 */
export const resetCommand = createWithResponse(
  types.RESET_COMMAND,
  payloadResetCommand,
  payloadResetMessage,
)

const payloadStartCommand    = (_puppetId: string)  => ({})
const payloadStartedMessage  = (_res: MetaResponse) => ({})

/**
 * puppet.start()
 */
export const startCommand = createWithResponse(
  types.START_COMMAND,
  payloadStartCommand,
  payloadStartedMessage,
)

const payloadStopCommand    = (_puppetId: string)   => ({})
const payloadStoppedMessage = (_res: MetaResponse)  => ({})

/**
 * puppet.stop()
 */
export const stopCommand = createWithResponse(
  types.STOP_COMMAND,
  payloadStopCommand,
  payloadStoppedMessage,
)
