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
/* eslint-disable no-redeclare */
import {
  type Observable,
  defer,
  of,
}                   from 'rxjs'
import type {
  ActionBuilder,
}                   from 'typesafe-actions'

import type {
  MetaRequest,
  MetaResponse,
}                   from '../duck/actions/meta.js'

import type { Bus } from '../bus.js'

import {
  mapCommandQueryToMessage,
}                             from './map-command-query-to-message.js'
import { send$ }              from './send$.js'

/**
 * Huan(202203): The const assignment is checked more strictly,
 *  and the compiler (correctly) complains that
 *  you can't safely treat a function of type
 *  `(name: string | number) => string | number` as a function of type
 *  `((name: string) => string) & ((name: number) => number)`.
 *
 *  @link https://stackoverflow.com/a/61366790/1123955
 */
export const execute$ = (bus$: Bus) => {

  /**
   * Void
   */
  function executeCommandQueryMessage (): (
    commandQuery: ActionBuilder<any, any, MetaRequest>,
  ) => Observable<never>

  /**
   * Non-void
   */
  function executeCommandQueryMessage <
    MType extends string,
    MPayload extends any,
    R extends MetaResponse,
  > (
    messageActionCreator: (res: R) => ActionBuilder<MType, MPayload, MetaResponse>,
  ): (
    commandQuery: ActionBuilder<any, any, MetaRequest>,
  ) => Observable<ActionBuilder<MType, MPayload, MetaResponse>>

  /**
   * Implementation
   */
  function executeCommandQueryMessage <
    MType extends string,
    MPayload extends any,
    R extends MetaResponse,
  > (
    messageActionCreator?: (res: R) => ActionBuilder<MType, MPayload, MetaResponse>,
  ): (
    commandQuery: ActionBuilder<any, any, MetaRequest>,
  ) => Observable<never | ActionBuilder<MType, MPayload, MetaResponse>> {
    return (commandQuery: ActionBuilder<any, any, MetaRequest>) => {
      if (typeof messageActionCreator === 'undefined') {
        return send$(bus$)(commandQuery)
      }

      return defer(() => of(commandQuery)).pipe(
        mapCommandQueryToMessage(bus$)(
          messageActionCreator,
        ),
      )
    }
  }

  return executeCommandQueryMessage
}
