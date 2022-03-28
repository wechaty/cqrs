#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
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
import { ActionBuilder, isActionOf }   from 'typesafe-actions'
import { of }           from 'rxjs'
import {
  catchError,
  filter,
  take,
  tap,
  timeout,
}                       from 'rxjs/operators'
import { log }          from 'wechaty-puppet'
import { GError }       from 'gerror'

import type { MetaRequest, MetaResponse } from '../cqr-event/meta.js'
import type { PayloadMetaActionFactory }  from '../cqr-event/payload-meta-action-factory.js'
import type { ClassifiedConstructor }     from '../classify/classify.js'
import type * as dto                      from '../dto/mod.js'
import type { BusObs }                    from '../bus.js'

/**
 * Monitor the `source$` to catch the `message` built by `messageActionBuilder` in response to the `commandQuery`
 *
 * @returns the message build by `messageActionBuilder`
 */
export const recv = (timeoutMilliseconds: number) =>
  <
    TCQType extends dto.types.CQ,
    TCQPayload extends {},

    TResArg extends MetaResponse,
    TResType extends dto.types.Type,
    TResPayload extends {},
  >(
    commandQuery  : ActionBuilder<TCQType, TCQPayload, MetaRequest>,
    ResponseClass : ClassifiedConstructor<PayloadMetaActionFactory<TResType, TResPayload, MetaResponse, [TResArg]>>,
  ) => (source$: BusObs) => source$.pipe(
    filter(isActionOf(ResponseClass)),
    tap(message => log.verbose('WechatyCqrs', 'execute$ recv() %s', JSON.stringify(message))),
    filter(message => message.meta.id === commandQuery.meta.id),
    timeout(timeoutMilliseconds),
    catchError(err =>
      of(
        new ResponseClass({
          ...commandQuery.meta,
          gerror: GError.stringify(err),
        } as TResArg),
      ).pipe(
        tap(() => console.error(err)),
      ),
    ),
    take(1),
  )
