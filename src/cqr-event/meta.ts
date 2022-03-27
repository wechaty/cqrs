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
import UUID from 'uuid'

/**
 * 1. Request
 */
export interface MetaRequest {
  id       : string
  puppetId : string
}

export const metaRequest: (puppetId: string, ..._: any) => MetaRequest
  = puppetId  => ({
    id: UUID.v4(),
    puppetId,
  })

/**
 * 2. Response
 *
 * All commands/queries share this response
 *  It only shows that whether the function call has been put successfully
 *  There will be nothing related to the state change of the bot
 */
export type MetaResponse = MetaRequest & {
  gerror?  : string
}

export const metaResponse: (res: MetaResponse) => MetaResponse
  = res => ({
    id       : res.id,
    puppetId : res.puppetId,
    gerror   : res.gerror,
  })
