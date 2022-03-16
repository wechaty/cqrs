/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
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
import type * as WECHATY  from 'wechaty'
import { log }            from 'wechaty-puppet'
import {
  Ducks,
  nopReducer,
}                         from 'ducks'
import {
  Subject,
}                         from 'rxjs'
import {
  createStore,
  compose,
  applyMiddleware,
}                         from 'redux'
import {
  WechatyRedux,
}                         from 'wechaty-redux'

import {
  commandQueryMiddleware,
  eventResponseMiddleware,
}                           from './middlewares/mod.js'
import * as CqrsDuck        from './duck/mod.js'

import type {
  Bus,
}                     from './bus.js'

export function from (
  wechaty: WECHATY.impls.WechatyInterface,
): Bus {
  log.verbose('WechatyCqrs', 'from(%s)', wechaty)

  const cqBus$ = new Subject<any>()
  const erBus$ = new Subject<any>()

  const ducks = new Ducks({ cqrs: CqrsDuck })
  const store = createStore(
    nopReducer,
    compose(  // Composes functions from right to left.
      applyMiddleware(
        /**
         * Huan(202203): cq - Commands & Queries
         *  `cqMiddleware` MUST be the most left one when calling `compose`
         *
         * to guarantee: send events to other middlewares
         */
        commandQueryMiddleware(cqBus$),
      ),
      ducks.enhancer(),
      applyMiddleware(
        /**
         * Huan(202203): er - Events & Responses
         *  `erMiddleware` MUST be the most right one when calling `compose`
         *
         * to guarantee that: receive events generated from other middlewares
         */
        eventResponseMiddleware(erBus$),
      ),
    ),
  )

  wechaty.use(
    WechatyRedux({ store }),
  )

  const bus$: Bus = Subject.create(cqBus$, erBus$)

  return bus$
}
