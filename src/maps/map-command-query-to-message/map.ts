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
import * as TimeConstants   from 'time-constants'
import type {
  ActionBuilder,
}                           from 'typesafe-actions'
import {
  Observable,
  Subject,
  merge,
}                           from 'rxjs'
import {
  mergeMap,
}                           from 'rxjs/operators'

import type {
  MetaRequest,
  MetaResponse,
}                   from '../../duck/actions/meta.js'

import { send$ } from './send$.js'
import { recv } from './recv.js'

type MapCommandQueryToMessage = (
  bus$                 : Subject<any>,
  timeoutMilliseconds? : number,
) => <
  TCommandQueryPayload  extends any,
  TCommandQueryType     extends string,
  TMessagePayload       extends any,
  TMessageType          extends string,
  TResponse             extends MetaResponse
> (
  messageBuilder : (res: TResponse) => ActionBuilder<TMessageType, TMessagePayload, MetaResponse>,
) => (
  source$: Observable<
    ActionBuilder<
      TCommandQueryType,
      TCommandQueryPayload,
      MetaRequest
    >
  >,
) => Observable<ActionBuilder<TMessageType, TMessagePayload, MetaResponse>>

/**
 * Huan(202203)
 *
 * Wait for the XXXMessage response for a Command/Query
 *  and return it.
 *
 * When timeout, return XXXMessage with a `gerror` in meta
 */
export const mapCommandQueryToMessage: MapCommandQueryToMessage = (
  bus$,
  timeoutMilliseconds =  15 * TimeConstants.SECOND,
) => (
  messageBuilder,
) => source$ => source$.pipe(
  mergeMap(commandQuery => merge(
    /**
     * Send
     */
    send$(bus$)(commandQuery),
    /**
     * Recv
     */
    bus$.pipe(
      recv(timeoutMilliseconds)(
        commandQuery,
        messageBuilder,
      ),
    ),
  )),
)
