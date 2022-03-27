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
import { log }            from 'wechaty-puppet'
import type {
  Middleware,
}                         from 'redux'
import _ from 'lodash'

import type {
  Bus,
}                 from '../bus.js'

/**
 * Input: Commands & Queries
 */
export const commandQueryMiddleware: (cqBus$: Bus) => Middleware = cqBus$ => _store => next => {
  cqBus$.subscribe(cq => {
    log.verbose('WechatyCqrs', 'commandQueryMiddleware() cqBus$.subscribe(%s)', JSON.stringify(cq))

    if (_.isPlainObject(cq)) next(cq)

    else next(_.toPlainObject(cq))

  })
  return action => next(action)
}
