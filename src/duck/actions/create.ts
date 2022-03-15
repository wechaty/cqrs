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

const MESSAGE = Symbol('MESSAGE')

export function create <
  CQType extends string,
  MType  extends string,

  CQPayload extends {},
  MPayload  extends {},

  TRes extends MetaResponse,
  TArgs extends any[],
> (
  commandQueryType : CQType, payloadCommandQuery : (puppetId: string, ...args: TArgs) => CQPayload,
  messageType      : MType,  payloadMessage      : (res: TRes)                        => MPayload,
) {
  const getQuery   = createAction(commandQueryType, payloadCommandQuery,  metaRequest)()
  const gotMessage = createAction(messageType,      payloadMessage,       metaResponse)()

  ;(getQuery as any)[MESSAGE] = gotMessage

  const commandQueryActionCreator: typeof getQuery & {
    [MESSAGE]: typeof gotMessage
  } = getQuery as any

  return commandQueryActionCreator
}

export const messageCreator = <
  MType extends string,
  MPayload extends {},
  TRes extends MetaResponse,
> (commandQueryCreator: {
  [MESSAGE]: (res: TRes) => PayloadMetaAction<MType, MPayload, MetaResponse>
}) => commandQueryCreator[MESSAGE]
