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
  from,
  of,
}                 from 'rxjs'
import {
  ignoreElements,
  catchError,
  mapTo,
  mergeMap,
  // tap,
}                 from 'rxjs/operators'
import { GError } from 'gerror'

import {
  getPuppet,
}             from '../registry/mod.js'

import * as actions from './actions.js'

const ding$ = (action: ReturnType<typeof actions.dingCommand>) => of(
  getPuppet(action.payload.puppetId),
).pipe(
  mergeMap(puppet => puppet
    ? of(puppet.ding(action.payload.data))
    : EMPTY,
  ),
  ignoreElements(),
  catchError(e => of(
    actions.errorReceivedEvent(
      action.payload.puppetId,
      { gerror: GError.stringify(e) },
    ),
  )),
)

const reset$ = (action: ReturnType<typeof actions.resetCommand>) => of(
  getPuppet(action.payload.puppetId),
).pipe(
  mergeMap(puppet => puppet
    ? of(puppet.reset())
    : EMPTY,
  ),
  ignoreElements(),
  catchError((e: Error) => of(
    actions.errorReceivedEvent(
      action.payload.puppetId,
      { gerror: GError.stringify(e) },
    ),
  )),
)

const say$ = (action: ReturnType<typeof actions.sayAsync.request>) => of(
  getPuppet(action.payload.puppetId),
).pipe(
  mergeMap(puppet => puppet
    ? from(puppet.messageSend(
      action.payload.conversationId,
      action.payload.sayable,
    ))
    : EMPTY,
  ),
  mapTo(actions.sayAsync.success({
    id       : action.payload.id,
    puppetId : action.payload.puppetId,
  })),
  catchError(e => of(
    actions.sayAsync.failure({
      gerror   : GError.stringify(e),
      id       : action.payload.id,
      puppetId : action.payload.puppetId,
    }),
  )),
)

export {
  ding$,
  reset$,
  say$,
}
