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
  createAction, PayloadMetaAction,
}                         from 'typesafe-actions'

import {
  metaRequest,
  metaResponse,
  MetaResponse,
}                 from './meta.js'

/**
 * Huan(202203): FIXME: use the real `Symbol` instead of a `string`
 *
 * Error message:
 *
 *  Exported variable 'resetCommand' has or is using name 'RESPONSE'
 *  from external module "/home/huan/git/wechaty/cqrs/src/duck/actions/create-action-pair"
 *  but cannot be named. ts(4023)
 */
export const RESPONSE = "Symbol('MESSAGE')"

export function createActionPair <
  CQType extends string,
  MType  extends string,

  CQPayload extends {},
  RPayload  extends {},

  TRes extends MetaResponse,
  TArgs extends any[],
> (
  commandQueryType : CQType, payloadCommandQuery : (puppetId: string, ...args: TArgs) => CQPayload,
  responseType     : MType,  payloadResponse     : (res: TRes)                        => RPayload,
) {
  const commandQuery  = createAction(commandQueryType, payloadCommandQuery,  metaRequest)()
  const response      = createAction(responseType,     payloadResponse,      metaResponse)()

  ;(commandQuery as any)[RESPONSE] = response

  const commandQueryActionCreator: typeof commandQuery & {
    [RESPONSE]: typeof response
  } = commandQuery as any

  return commandQueryActionCreator
}

export interface Responseable <
  TType     extends string,
  TPayload  extends {},
  TResponse extends MetaResponse,
> {
  [RESPONSE]: (res: TResponse) => PayloadMetaAction<TType, TPayload, MetaResponse>
}

export const responseActionOf = <
  TType     extends string,
  TPayload  extends {},
  TResponse extends MetaResponse,
> (actionPair: Responseable<TType, TPayload, TResponse>) => actionPair[RESPONSE]
