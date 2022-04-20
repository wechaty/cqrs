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
import { of }           from 'rxjs'
import { GError }       from 'gerror'
import { getPuppet }    from 'wechaty-redux'
import { log }          from 'wechaty-puppet'
import { isActionOf }   from 'typesafe-actions'
import type { Epic }    from 'redux-observable'

import * as actions from '../../actions/mod.js'

export const authQrCodeEpic: Epic = actions$ => actions$.pipe(
  filter(isActionOf(actions.getAuthQrCodeQuery)),
  tap(query => log.verbose('WechatyCqrs', 'authQrCodeEpic() %s', JSON.stringify(query))),
  mergeMap(query => of(query.meta.puppetId).pipe(
    map(getPuppet),
    map(puppet => puppet?.authQrCode),
    map(qrcode => actions.getAuthQrCodeQueryResponse({
      ...query.meta,
      qrcode,
    })),
    catchError(e => of(
      actions.getAuthQrCodeQueryResponse({
        ...query.meta,
        gerror: GError.stringify(e),
      }),
    )),
  )),
)
