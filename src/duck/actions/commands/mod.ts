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
import { createAction }   from 'typesafe-actions'

import {
  metaRequest,
  metaResponse,
  MetaResponse,
}                     from '../../../cqr-event/meta.js'

import * as types from '../../types/mod.js'

/**
 *
 * Private used internally inside this NPM module only
 *
 */
const payloadNopCommand         = (_puppetId: string)   => ({})
const payloadNopCommandResponse = (_res: MetaResponse)  => ({})

export const NOP_COMMAND          = createAction(types.NOP_COMMAND,           payloadNopCommand,          metaRequest)()
export const NOP_COMMAND_RESPONSE = createAction(types.NOP_COMMAND_RESPONSE,  payloadNopCommandResponse,  metaResponse)()

/**
 * puppet.messageSend()
 */
const payloadSendMessageCommand         = (_puppetId: string, conversationId: string, sayable: PUPPET.payloads.Sayable) => ({ conversationId, sayable })
const payloadSendMessageCommandResponse = (res: MetaResponse & { messageId?: string })                                  => ({ messageId: res.messageId })

export const SEND_MESSAGE_COMMAND           = createAction(types.SEND_MESSAGE_COMMAND,          payloadSendMessageCommand,          metaRequest)()
export const SEND_MESSAGE_COMMAND_RESPONSE  = createAction(types.SEND_MESSAGE_COMMAND_RESPONSE, payloadSendMessageCommandResponse,  metaResponse)()

/**
 * puppet.ding()
 */
const payloadDingCommand          = (_puppetId: string, data?: string)  => ({ data })
const payloadDingCommandResponse  = (_res: MetaResponse)                => ({})

export const DING_COMMAND           = createAction(types.DING_COMMAND,          payloadDingCommand,         metaRequest)()
export const DING_COMMAND_RESPONSE  = createAction(types.DING_COMMAND_RESPONSE, payloadDingCommandResponse, metaResponse)()

/**
 * puppet.reset()
 */
const payloadResetCommand         = (_puppetId: string, data?: string)  => ({ data })
const payloadResetCommandResponse = (_res: MetaResponse)                => ({})

export const RESET_COMMAND          = createAction(types.RESET_COMMAND,           payloadResetCommand,          metaRequest)()
export const RESET_COMMAND_RESPONSE = createAction(types.RESET_COMMAND_RESPONSE,  payloadResetCommandResponse,  metaResponse)()

/**
 * puppet.start()
 */
const payloadStartCommand         = (_puppetId: string)  => ({})
const payloadStartCommandResponse = (_res: MetaResponse) => ({})

export const START_COMMAND          = createAction(types.START_COMMAND,           payloadStartCommand,          metaRequest)()
export const START_COMMAND_RESPONSE = createAction(types.START_COMMAND_RESPONSE,  payloadStartCommandResponse,  metaResponse)()

/**
 * puppet.stop()
 */
const payloadStopCommand          = (_puppetId: string)   => ({})
const payloadStopCommandResponse  = (_res: MetaResponse)  => ({})

export const STOP_COMMAND           = createAction(types.STOP_COMMAND,          payloadStopCommand,         metaRequest)()
export const STOP_COMMAND_RESPONSE  = createAction(types.STOP_COMMAND_RESPONSE, payloadStopCommandResponse, metaResponse)()
