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
}                     from 'rxjs'
import type {
  PayloadMetaAction,
}                     from 'typesafe-actions'

import type {
  MetaRequest,
  MetaResponse,
}                     from '../cqr-event/meta.js'

import type { Bus }   from '../bus.js'

import {
  Pair,
  responseOf,
}                     from '../cqr-event/event-pair.js'

import { TIMEOUT_MS } from './constants.js'
import { recv }       from './recv.js'
import { send$ }      from './send$.js'

interface ExecuteOptions {
  timeoutMilliseconds: number,
}

export const execute$ = (
  bus$    : Bus,
  options : ExecuteOptions = { timeoutMilliseconds: TIMEOUT_MS },
) =>
<
  CQArgs extends any[],
  CQType extends string,
  CQPayload extends {},

  RArgs extends any[],
  RType extends string,
  RPayload extends {},

  CQ  extends (..._: CQArgs)  => PayloadMetaAction <CQType,  CQPayload,  MetaRequest>,
  R   extends (..._: RArgs)   => PayloadMetaAction <RType,   RPayload,   MetaResponse>,
> (actionPair: Pair<CQ, R>) => (
    action: ReturnType<CQ>,
  ) => merge(
    /**
     * Recv
     *
     * Huan(202203):
     *  `recv` should be put before(at the leftest) the `send$`
     *  because it need to subscribe the bus before sending any events
     */
    bus$.pipe(
      recv(options.timeoutMilliseconds)(
        action,
        responseOf(actionPair),
      ),
    ),
    /**
     * Send
     *
     * Huan(202203):
     *  The `send$()` must be put after (at the rightest) the `recv()`
     *  because it must wait the `recv()` to be registered to the stream first.
     */
    send$(bus$)(action),
  )
