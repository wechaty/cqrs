#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

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
  test,
  testSchedulerRunner,
}                         from 'tstest'
import {
  Subject,
  merge,
  mergeMap,
}                         from 'rxjs'

import * as CqrsDuck from '../duck/mod.js'

import { send$ } from './send$.js'

test('send$()', testSchedulerRunner(m => {
  const PUPPET_ID   = 'puppet-id'
  const CONTACT_ID  = 'contact-id'

  const command = CqrsDuck.actions.getCurrentUserIdQuery(PUPPET_ID)
  const message = CqrsDuck.actions.currentUserIdGotMessage({
    contactId : CONTACT_ID,
    id        : command.meta.id,
    puppetId  : command.meta.puppetId,
  })

  const values = {
    c: command,
    m: message,
  }

  const source    = '-x'
  const expected  = '-c'

  const bus$ = new Subject<any>()
  const source$ = m.hot(source)

  const result$ = source$.pipe(
    mergeMap(() => merge(
      /**
       * `bus$` need to be put to the left (before) of the `send$`
       *  so that it will not miss the events which sent inside the `send$` function
       */
      bus$,
      send$(bus$)(command),
    )),
  )

  m.expectObservable(result$).toBe(expected, values)
}))
