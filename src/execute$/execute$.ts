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
import {
  merge,
  EMPTY,
  Observable,
}                             from 'rxjs'
import type { ActionBuilder } from 'typesafe-actions'

import { dtoResponseClass }   from '../cqr-event/dto-response-class.js'
import type { MetaRequest }   from '../cqr-event/meta.js'
import type * as dto          from '../dto/mod.js'
import type { Bus }           from '../bus.js'
import { TIMEOUT_MS }         from '../config.js'

import { recv }         from './recv.js'
import { send$ }        from './send$.js'

interface ExecuteOptions {
  timeoutMilliseconds: number,
}

/**
 * Execute a `command` or `query` and get the `response` from `bus$` with a timeout option.
 *
 * @param {Bus} bus$ - The bus instance.
 * @param {ExecuteOptions} options
 * @param {dto.CommandQuery} commandQuery - the command to execute
 * @returns {Observable<dto.Response>} - the response of the command
 * @example
 * const command = new CQRS.dto.commands.DingCommand('puppet-id', 'data')
 * const response$ = execute$(bus$)(command)
 */
export const execute$ = (
  bus$    : Bus,
  options : ExecuteOptions = { timeoutMilliseconds: TIMEOUT_MS },
) => <
  TType extends dto.types.CommandQuery,
  TPayload extends {}
> (action: ActionBuilder<TType, TPayload, MetaRequest>) => {

  const ResponseClass = dtoResponseClass(action.type)
  // console.info('ResponseClass', ResponseClass)

  /**
   * Force check the `ResponseClass` existance
   */
  const recv$ = ResponseClass as undefined | typeof ResponseClass
    ? bus$.pipe(
      // tap(e => console.info('tap', e)),
      recv(options.timeoutMilliseconds)(
        action,
        /**
         * Huan(202203) FIXME: remove `as any`
         */
        ResponseClass as any,
      ),
    ) as Observable<InstanceType<typeof ResponseClass>>
    : EMPTY

  return merge(
    /**
     * Recv
     *
     * Huan(202203):
     *  `recv` should be put before(at the leftest) the `send$`
     *  because it need to subscribe the bus before sending any events
     */
    recv$,

    /**
     * Send
     *
     * Huan(202203):
     *  The `send$()` must be put after (at the rightest) the `recv()`
     *  because it must wait the `recv()` to be registered to the stream first.
     */
    send$(bus$)(action),
  )
}
