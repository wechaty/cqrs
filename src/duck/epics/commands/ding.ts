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
  EMPTY,
  of,
}                     from 'rxjs'
import {
  catchError,
  mergeMap,
  map,
  filter,
  tap,
}                     from 'rxjs/operators'
import { GError }     from 'gerror'
import { log }        from 'wechaty-puppet'
import type { Epic }  from 'redux-observable'
import { getPuppet }  from 'wechaty-redux'
import { isActionOf } from 'typesafe-actions'

import * as actions from '../../actions/mod.js'

export const dingEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.dingCommand)),
  tap(command => log.verbose('WechatyCqrs', 'dingEpic() %s', JSON.stringify(command))),
  mergeMap(command => of(command.meta.puppetId).pipe(
    map(getPuppet),
    mergeMap(puppet => puppet
      ? of(puppet.ding(command.payload.data))
      : EMPTY,
    ),
    map(() => actions.dingCommandResponse({
      id       : command.meta.id,
      puppetId : command.meta.puppetId,
    })),
    catchError(e => of(
      actions.dingCommandResponse({
        ...command.meta,
        gerror: GError.stringify(e),
      }),
    )),
  )),
)
