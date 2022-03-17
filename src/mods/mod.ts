/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
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
import { packageJson }  from '../package-json.js'

/**
 * Command, Query, Response, and Event
 */
export * as commands    from './commands.js'
export * as queries     from './queries.js'
export * as events      from './events.js'
export * as responses   from './responses.js'

export {
  type Bus,
  type BusObs,
}                       from '../bus.js'
export { from }         from '../cqrs.js'
export { execute$ }     from '../execute$/mod.js'

export * as events$     from './events$.js'
export * as sayables    from './sayables.js'
export * as duck        from './duck.js'

export { isActionOf as isEventOf }   from 'typesafe-actions'

export const VERSION = packageJson.version || '0.0.0'
export const NAME    = packageJson.name    || 'NONAME'
