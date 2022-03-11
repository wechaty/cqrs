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
  of,
}                 from 'rxjs'
import {
  catchError,
  mergeMap,
  map,
}                 from 'rxjs/operators'
import { GError } from 'gerror'

import {
  getPuppet,
}             from 'wechaty-redux'

import * as actions from '../actions/mod.js'

export const currentUserId$ = (action: ReturnType<typeof actions.getCurrentUserIdQuery>) => of(
  getPuppet(action.meta.puppetId),
).pipe(
  mergeMap(puppet => puppet?.isLoggedIn
    ? of(puppet.currentUserId)
    : of(undefined),
  ),
  map(contactId => actions.currentUserIdGotMessage({
    contactId,
    id       : action.meta.id,
    puppetId : action.meta.puppetId,
  })),
  catchError(e => of(
    actions.currentUserIdGotMessage({
      gerror   : GError.stringify(e),
      id       : action.meta.id,
      puppetId : action.meta.puppetId,
    }),
  )),
)
