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
import type { Dispatch }  from 'redux'
import type * as PUPPET   from 'wechaty-puppet'

import * as actions from './actions/mod.js'

const ding  = (dispatch: Dispatch) => (puppetId: string, data?: string)  => dispatch(actions.dingCommand(puppetId, data))
const reset = (dispatch: Dispatch) => (puppetId: string, data?: string)  => dispatch(actions.resetCommand(puppetId, data))

const sendMessage = (dispatch: Dispatch) => (
  puppetId       : string,
  conversationId : string,
  sayable        : PUPPET.payloads.Sayable,
) => dispatch(actions.sendMessageCommand(puppetId, conversationId, sayable))

const nop = (dispatch: Dispatch) => (puppetId: string) => dispatch(actions.nop(puppetId))

export {
  ding,
  reset,
  sendMessage,

  nop,
}
