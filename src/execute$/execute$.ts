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
import { merge, EMPTY }       from 'rxjs'
import type { ActionBuilder } from 'typesafe-actions'

import { getResponseClass } from '../cqr-event/get-object-creator.js'
import type { MetaRequest } from '../cqr-event/meta.js'
import type * as duck       from '../duck/mod.js'
import type { Bus }         from '../bus.js'

import { TIMEOUT_MS } from './constants.js'
import { recv }       from './recv.js'
import { send$ }      from './send$.js'
import type { MetaActionCreator } from '../cqr-event/meta-action-creator.js'

interface ExecuteOptions {
  timeoutMilliseconds: number,
}

export const execute$ = (
  bus$    : Bus,
  options : ExecuteOptions = { timeoutMilliseconds: TIMEOUT_MS },
) => <
  TType extends duck.Type,
  TPayload extends {},
  TMeta extends MetaRequest,
> (action: ReturnType<MetaActionCreator<TType, TPayload, TMeta>>) => {

  const ResponseClass = getResponseClass(action.type)
  // console.info('ResponseClass', ResponseClass)

  /**
   * Force check the `ResponseClass` existance
   */
  const recv$ = (ResponseClass as any)
    ? bus$.pipe(
      // tap(e => console.info('tap', e)),
      recv(options.timeoutMilliseconds)(
        action,
        ResponseClass,
      ),
    )
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
    // bus$.pipe(
    //   recv(options.timeoutMilliseconds)(
    //     action,
    //     responseOf(actionPair),
    //   ),
    // ),
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
