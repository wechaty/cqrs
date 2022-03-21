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
import type {
  ActionBuilder,
}                         from 'typesafe-actions'

import type {
  MetaResponse,
}                 from './meta.js'

/**
 * We add `_RESPONSE` to the end of the `type` for the Response Event for Command/Query
 */
const _RESPONSE = '_RESPONSE'
export type ResponseType<T extends string> = `${T}${typeof _RESPONSE}`
export const responseType = <T extends string> (type: T) => `${type}${_RESPONSE}` as ResponseType<T>

/**
 * Huan(202203): FIXME: use the real `Symbol` instead of a `string`
 *
 * Error message:
 *
 *  Exported variable 'resetCommand' has or is using name 'RESPONSE'
 *  from external module "/home/huan/git/wechaty/cqrs/src/duck/actions/create-action-pair"
 *  but cannot be named. ts(4023)
 */
export const RESPONSE = Symbol('RESPONSE')
export interface Responseable <
  R extends (..._: any) => ActionBuilder<any, any, MetaResponse> = (..._: any) => ActionBuilder<any, any, MetaResponse>,
> {
  [RESPONSE]: R
}

export type ResponseOf<T extends Responseable> = T[typeof RESPONSE]
// Huan(202203) the tailing `as T[...]` is not necessary in theory but it seems to be a bug in TS
export const responseOf = <T extends Responseable> (responseable: T) => responseable[RESPONSE] as T[typeof RESPONSE]

export type ActionOf<T extends Responseable> = Omit<T, typeof RESPONSE>
export const actionOf = <T extends Responseable>(action: T): ActionOf<T> => action
