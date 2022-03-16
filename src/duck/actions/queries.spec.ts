#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License")
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
import { test } from 'tstest'

import * as queries       from './queries.js'
import { responseOf } from './action-pair.js'

test('queries smoke testing', async t => {
  const ID = 'uuidv4'
  const PUPPET_ID = 'puppet-id'
  const CONTACT_ID = 'contact-id'

  const q = queries.getCurrentUserIdQuery(PUPPET_ID)
  t.ok(q.meta.id, 'should set id to meta')
  t.equal(q.meta.puppetId, PUPPET_ID, 'should set puppetId to meta')

  const currentUserIdGotResponse = responseOf(queries.getCurrentUserIdQuery)

  const e = currentUserIdGotResponse({
    contactId: CONTACT_ID,
    id: ID,
    puppetId: PUPPET_ID,
  })
  t.equal(e.meta.gerror, undefined, 'should has no gerror')
  t.equal(e.meta.id, ID, 'should set id to meta')
  t.equal(e.meta.puppetId, PUPPET_ID, 'should set puppetId to meta')
  t.equal(e.payload.contactId, CONTACT_ID, 'should set contact id to payload')
})
