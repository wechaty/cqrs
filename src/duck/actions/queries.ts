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

/* eslint-disable sort-keys */

import {
  createAction,
}                         from 'typesafe-actions'
import type * as PUPPET   from 'wechaty-puppet'

import * as types from '../types.js'

import {
  metaRequest,
  metaResponse,
  MetaResponse,
}                 from './meta.js'

const payloadGetCurrentUserQuery  = (puppetId: string)  => ({ puppetId })
const payloadCurrentUserGotEvent  = (res: MetaResponse & { contact: PUPPET.payloads.Contact }) => ({ ...res.contact })

export const getCurrentUserQuery  = createAction(types.GET_CURRENT_USER_QUERY, payloadGetCurrentUserQuery, metaRequest)()
export const currentUserGotEvent  = createAction(types.CURRENT_USER_GOT_EVENT, payloadCurrentUserGotEvent, metaResponse)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
// const nop = createAction(types.NOP)()
