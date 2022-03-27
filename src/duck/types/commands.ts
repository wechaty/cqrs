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
 * @internal
 */
export const NOP_COMMAND  = 'cqrs-wechaty/NOP_COMMAND'  // internal NOP

/**
 * @public
 */
export const DING_COMMAND         = 'cqrs-wechaty/DING_COMMAND'          // ding()
export const RESET_COMMAND        = 'cqrs-wechaty/RESET_COMMAND'         // reset()
export const SEND_MESSAGE_COMMAND = 'cqrs-wechaty/SEND_MESSAGE_COMMAND'  // messageSend()
export const START_COMMAND        = 'cqrs-wechaty/START_COMMAND'         // start()
export const STOP_COMMAND         = 'cqrs-wechaty/STOP_COMMAND'          // stop()
