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
import { defer, EMPTY }   from 'rxjs'
import type { ActionBuilder } from 'typesafe-actions'
import { log }            from 'wechaty-puppet'

import type { Bus } from '../bus.js'
import type { MetaRequest } from '../cqr-event/meta.js'

import type * as duck from '../duck/mod.js'

/**
 * Send the `commandQuery` to `bus$`
 *
 * @returns `EMPTY` observable
 */
export const send$ = (bus$: Bus) => <
  TType extends duck.Type,
  T extends ActionBuilder<TType, {}, MetaRequest>
> (commandQuery: T) => defer(() => {
    log.verbose('WechatyCqrs', 'execute$ send$() defer() bus$.next(%s)', JSON.stringify(commandQuery))
    /**
     * SO: Observable.onSubscribe equivalent in RxJs
     *  @link https://stackoverflow.com/a/48983205/1123955
     */
    // Huan(202203): FIXME: remove any
    bus$.next(commandQuery as any)
    return EMPTY
  })
