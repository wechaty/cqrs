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
* Commands & paired-Events
*/
export const DING_COMMAND  = 'cqrs-wechaty/DING_COMMAND'
export const DINGED_EVENT  = 'cqrs-wechaty/DINGED_EVENT'

export const RESET_COMMAND = 'cqrs-wechaty/RESET_COMMAND'
export const RESETED_EVENT = 'cqrs-wechaty/RESETED_EVENT'

export const SEND_MESSAGE_COMMAND = 'cqrs-wechaty/SEND_MESSAGE_COMMAND'
export const MESSAGE_SENT_EVENT   = 'cqrs-wechaty/MESSAGE_SENT_EVENT'

/**
 * Queries & paired-Events
 */
export const GET_CURRENT_USER_ID_QUERY = 'cqrs-wechaty/GET_CURRENT_USER_ID_QUERY'
export const CURRENT_USER_ID_GOT_EVENT = 'cqrs-wechaty/CURRENT_USER_ID_GOT_EVENT'

export const GET_IS_LOGGED_IN_QUERY = 'cqrs-wechaty/GET_IS_LOGGED_IN_QUERY'
export const IS_LOGGED_IN_GOT_EVENT = 'cqrs-wechaty/IS_LOGGED_IN_GOT_EVENT'
