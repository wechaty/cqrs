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
import type { Action, ActionType } from 'typesafe-actions'

import reducer            from './reducers.js'

import type * as actions  from './actions/mod.js'
export type Payload  = ActionType<typeof actions>
export type Type     = ActionType<typeof actions> extends Action<infer T> ? T : never

export default reducer
export { reducer }

export * as actions     from './actions/mod.js'
export * as epics       from './epics/mod.js'
export * as operations  from './operations.js'
export * as selectors   from './selectors.js'
export * as types       from './types/mod.js'
export * as utils       from './utils.js'
