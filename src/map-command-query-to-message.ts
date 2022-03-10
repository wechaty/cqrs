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
import {
  ActionBuilder,
  isActionOf,
}                           from 'typesafe-actions'
import {
  Observable,
  of,
}                           from 'rxjs'
import {
  catchError,
  filter,
  mergeMap,
  take,
  timeout,
}                           from 'rxjs/operators'

import type {
  MetaRequest,
  MetaResponse,
}                   from './duck/actions/meta.js'

export const mapCommandQueryToMessage: (
  bus$: Observable<any>,
  timeoutMilliseconds?: number,
) => <CQP extends any, MP extends any, MR extends MetaResponse> (
  cqActionBuilder: (...args: any) => ActionBuilder<any, CQP, MetaRequest>,
  messageActionBuilder: (res: MR) => ActionBuilder<any, MP, MetaResponse>,
) => (
  source$: Observable<ActionBuilder<any, CQP, MetaRequest>>,
) => Observable<ActionBuilder<any, MP, MetaResponse>> = (bus$, timeoutMilliseconds =  5 * TimeConstants.SECOND) => (_cq, messageActionBuilder) => source$ => source$.pipe(
  mergeMap(query => bus$.pipe(
    filter(isActionOf(messageActionBuilder)),
    filter(message => message.meta.id === query.meta.id),
    timeout(timeoutMilliseconds),
    catchError(err => of(
      messageActionBuilder({
        gerror   : JSON.stringify(err),
        id       : query.meta.id,
        puppetId : query.meta.puppetId,
      } as MetaResponse as any),  // Huan(202203): FIXME: remove any
    )),
  )),
  take(1),
)
