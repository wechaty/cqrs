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

/**
 *
 * Internal
 *
 */
export const NOP_COMMAND = 'cqrs-wechaty/NOP_COMMAND'
export const NOP_MESSAGE = 'cqrs-wechaty/NOP_MESSAGE'

/**
 *
 * Commands & paired-Messages
 *
 */

/**
 * puppet.ding()
 */
export const DING_COMMAND   = 'cqrs-wechaty/DING_COMMAND'
export const DINGED_MESSAGE = 'cqrs-wechaty/DINGED_MESSAGE'

/**
 * puppet.reset()
 */
export const RESET_COMMAND  = 'cqrs-wechaty/RESET_COMMAND'
export const RESET_MESSAGE  = 'cqrs-wechaty/RESET_MESSAGE'

/**
 * puppet.messageSend()
 */
export const SEND_MESSAGE_COMMAND = 'cqrs-wechaty/SEND_MESSAGE_COMMAND'
export const MESSAGE_SENT_MESSAGE = 'cqrs-wechaty/MESSAGE_SENT_MESSAGE'

/**
 * puppet.start()
 */
export const START_COMMAND    = 'cqrs-wechaty/START_COMMAND'
export const STARTED_MESSAGE  = 'cqrs-wechaty/STARTED_MESSAGE'

/**
 * puppet.start()
 */
export const STOP_COMMAND     = 'cqrs-wechaty/STOP_COMMAND'
export const STOPPED_MESSAGE  = 'cqrs-wechaty/STOPPED_MESSAGE'

/**
 *
 * Queries & paired-Messages
 *
 */

/**
 * puppet.currentUserId
 */
export const GET_CURRENT_USER_ID_QUERY    = 'cqrs-wechaty/GET_CURRENT_USER_ID_QUERY'
export const CURRENT_USER_ID_GOT_MESSAGE  = 'cqrs-wechaty/CURRENT_USER_ID_GOT_MESSAGE'

/**
 * puppet.isLoggedIn
 */
export const GET_IS_LOGGED_IN_QUERY   = 'cqrs-wechaty/GET_IS_LOGGED_IN_QUERY'
export const IS_LOGGED_IN_GOT_MESSAGE = 'cqrs-wechaty/IS_LOGGED_IN_GOT_MESSAGE'

/**
 * puppet.sayablePayload
 */
export const GET_SAYABLE_PAYLOAD_QUERY   = 'cqrs-wechaty/GET_SAYABLE_PAYLOAD_QUERY'
export const SAYABLE_PAYLOAD_GOT_MESSAGE = 'cqrs-wechaty/SAYABLE_PAYLOAD_GOT_MESSAGE'

/**
 * puppet.messagePayload
 */
export const GET_MESSAGE_PAYLOAD_QUERY   = 'cqrs-wechaty/GET_MESSAGE_PAYLOAD_QUERY'
export const MESSAGE_PAYLOAD_GOT_MESSAGE = 'cqrs-wechaty/MESSAGE_PAYLOAD_GOT_MESSAGE'
