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
  catchError,
  mergeMap,
  map,
  filter,
  tap,
}                       from 'rxjs/operators'
import { of, from }     from 'rxjs'
import { GError }       from 'gerror'
import { getPuppet }    from 'wechaty-redux'
import type { Epic }    from 'redux-observable'
import { isActionOf }   from 'typesafe-actions'
import { log }          from 'wechaty-puppet'

import * as actions from '../../actions/mod.js'

export const contactPayloadEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.GET_CONTACT_PAYLOAD_QUERY)),
  tap(query => log.verbose('WechatyCqrs', 'contactPayloadEpic() %s', JSON.stringify(query))),
  mergeMap(query => of(query.meta.puppetId).pipe(
    map(getPuppet),
    mergeMap(puppet => puppet
      ? from(puppet.contactPayload(query.payload.contactId))
      : of(undefined),
    ),
    map(payload => actions.GET_CONTACT_PAYLOAD_QUERY_RESPONSE({
      contact  : payload,
      id       : query.meta.id,
      puppetId : query.meta.puppetId,
    })),
    catchError(e => of(
      actions.GET_CONTACT_PAYLOAD_QUERY_RESPONSE({
        ...query.meta,
        gerror: GError.stringify(e),
      }),
    )),
  )),
)
