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
import * as WechatyRedux from 'wechaty-redux'

/**
 * Huan(202203): reuse Events from Wechaty Redux
 */
export const {
  STATE_ACTIVATED_EVENT,
  STATE_INACTIVATED_EVENT,

  STARTED_EVENT,
  STOPPED_EVENT,

  DONG_RECEIVED_EVENT,
  ERROR_RECEIVED_EVENT,
  FRIENDSHIP_RECEIVED_EVENT,
  HEARTBEAT_RECEIVED_EVENT,
  LOGIN_RECEIVED_EVENT,
  LOGOUT_RECEIVED_EVENT,
  MESSAGE_RECEIVED_EVENT,
  READY_RECEIVED_EVENT,
  RESET_RECEIVED_EVENT,
  ROOM_INVITE_RECEIVED_EVENT,
  ROOM_JOIN_RECEIVED_EVENT,
  ROOM_LEAVE_RECEIVED_EVENT,
  ROOM_TOPIC_RECEIVED_EVENT,
  SCAN_RECEIVED_EVENT,
}                             = WechatyRedux.Duck.actions
