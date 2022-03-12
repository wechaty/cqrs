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
import {
  ActionBuilder,
  isActionOf,
}                           from 'typesafe-actions'
import {
  of,
}                           from 'rxjs'
import {
  catchError,
  filter,
  take,
  timeout,
}                           from 'rxjs/operators'

import type {
  MetaRequest,
  MetaResponse,
}                   from '../../duck/actions/meta.js'

import type {
  BusObs,
}                   from '../../cqrs.js'

/**
 * Monitor the `source$` to catch the `message` built by `messageActionBuilder` in response to the `commandQuery`
 *
 * @returns the message build by `messageActionBuilder`
 */
export const recv = (timeoutMilliseconds: number) =>
  <
    MPayload extends any,
    TMetaResponse extends MetaResponse
  >(
    commandQuery         : ActionBuilder<any,              any,      MetaRequest>,
    messageActionBuilder : (res: TMetaResponse) => ActionBuilder<any, MPayload, MetaResponse>,
  ) => (source$: BusObs) => source$.pipe(
    filter(isActionOf(messageActionBuilder)),
    filter(message => message.meta.id === commandQuery.meta.id),
    timeout(timeoutMilliseconds),
    catchError(err => of(
      messageActionBuilder({
        gerror   : JSON.stringify(err),
        id       : commandQuery.meta.id,
        puppetId : commandQuery.meta.puppetId,
      } as MetaResponse as any),  // Huan(202203): FIXME: remove any
    )),
    take(1),
  )
