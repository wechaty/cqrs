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
import { getType } from 'typesafe-actions'
import type { Type } from '../duck/mod.js'

import type { MetaActionCreator }         from './meta-action-creator.js'
import { responseType, ResponseType }     from './response-type.js'
import { TypeActionMap, typeActionMap }   from './type-action-map.js'

/**
 * Support both `type` and `MetaActionCreator<type>` as parameter
 */
export type ResponseOf<
  T extends string | MetaActionCreator<Type, any, any>,
> = T extends string
  ? ResponseType<T> extends Type ? TypeActionMap[ResponseType<T>] : never
  : T extends MetaActionCreator<infer TType, any, any>
    ? ResponseType<TType> extends Type ? TypeActionMap[ResponseType<TType>] : never
    : never

export const responseOf = <
  T extends string | MetaActionCreator<Type, any, any>,
> (type: T) => typeof type === 'string'
    ? (typeActionMap as any)[responseType(type)] as ResponseOf<T>
    : (typeActionMap as any)[responseType(getType(type))] as ResponseOf<T>
