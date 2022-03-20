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

import {
  Responseable,
  RESPONSE,
  responseType,
}                 from './response.js'

export type ResponsePair<
  CQ  extends (..._: any) => PayloadMetaAction<any, any, MetaRequest>,
  R   extends (..._: any) => PayloadMetaAction<any, any, MetaResponse>,
> =
  & CQ
  & Responseable<R>

export type ActionOf<T extends Responseable> = Omit<T, typeof RESPONSE>
export const actionOf = <T extends Responseable>(action: T): ActionOf<T> => action

export type ResponseOf<T extends Responseable> = T[typeof RESPONSE]
export const responseOf = <T extends Responseable> (pair: T) => pair[RESPONSE]

export function createWithResponse <
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
  const commandQuery  = createAction(commandQueryType,                payloadCommandQuery,  metaRequest)()
  const response      = createAction(responseType(commandQueryType),  payloadResponse,      metaResponse)()

  const pair: ResponsePair<
    typeof commandQuery,
    typeof response
  > = Object.assign(commandQuery, {
    [RESPONSE]: response,
  })

  // ;(commandQuery as unknown as ResponsePair<typeof commandQuery, typeof response>)[RESPONSE] = response
  // const pair: typeof commandQuery & {
  //   [RESPONSE]: typeof response
  // } = commandQuery as any

  return pair
}
