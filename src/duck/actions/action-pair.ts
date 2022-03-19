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
  createAction,
  PayloadMetaAction,
}                         from 'typesafe-actions'

import {
  MetaRequest,
  metaRequest,
  metaResponse,
  MetaResponse,
}                 from './meta.js'

export const toResponseType = <T extends string> (type: T) => `${type}_RESPONSE` as `${T}_RESPONSE`

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
export interface Responseable <
  R extends (..._: any) => PayloadMetaAction<any, any, MetaResponse> = (..._: any) => PayloadMetaAction<any, any, MetaResponse>,
> {
  [RESPONSE]: R
}

export type Pair<
  CQ  extends (..._: any) => PayloadMetaAction<any, any, MetaRequest>,
  R   extends (..._: any) => PayloadMetaAction<any, any, MetaResponse>,
> =
  & CQ
  & Responseable<R>

export type ActionOf<T extends Responseable> = Omit<T, typeof RESPONSE>
export const actionOf = <T extends Responseable>(action: T): ActionOf<T> => action

export type ResponseOf<T extends Responseable> = T[typeof RESPONSE]
export const responseOf = <T extends Responseable> (actionPair: T) => actionPair[RESPONSE]

export function create <
  TType extends string,

  CQPayload extends {},
  RPayload  extends {},

  TRes  extends MetaResponse,
  TArgs extends any[],
> (
  commandQueryType    : TType,
  payloadCommandQuery : (puppetId: string, ...args: TArgs) => CQPayload,
  payloadResponse     : (res: TRes)                        => RPayload,
) {
  /**
   * We add `Response` to the end of the `type` for the Response Event for Command/Query
   */
  const responseType = toResponseType(commandQueryType)

  const commandQuery  = createAction(commandQueryType,  payloadCommandQuery,  metaRequest)()
  const response      = createAction(responseType,      payloadResponse,      metaResponse)()

  ;(commandQuery as unknown as Pair<typeof commandQuery, typeof response>)[RESPONSE] = response

  const pair: typeof commandQuery & {
    [RESPONSE]: typeof response
  } = commandQuery as any

  return pair
}
