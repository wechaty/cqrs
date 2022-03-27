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
import { log }              from 'wechaty-puppet'
import type { Middleware }  from 'redux'

import { plainToInstance }  from '../classify/plain-to-instance.js'
import type { Bus }         from '../bus.js'

/**
 * Output: Events & Response
 */
export const eventResponseMiddleware: (erBus$: Bus) => Middleware = erBus$ =>
  _store =>
    next =>
      action => {
        log.verbose('WechatyCqrs', 'eventResponseMiddleware() erBus$.next(%s)', JSON.stringify(action))

        /**
         * Data Transfer Object (DTO) transision:
         *  Convert the object from a Plain Object to a Instance Object (and compatible with the Plain Object)
         */
        const instanceOrPlainObject = plainToInstance(action) || action
        erBus$.next(instanceOrPlainObject)

        next(action)
      }
