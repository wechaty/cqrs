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
import * as types from '../types/mod.js'

import type {
  MetaResponse,
}                     from '../../cqr-event/meta.js'

import {
  createWithResponse,
}                     from '../../cqr-event/event-pair.js'

/**
 *
 * Private used internally inside this NPM module only
 *
 */
const payloadNopCommand = (_puppetId: string)   => ({})
const payloadNopMessage = (_res: MetaResponse)  => ({})

export const nopCommand = createWithResponse(
  types.NOP_COMMAND,
  payloadNopCommand,
  payloadNopMessage,
)
