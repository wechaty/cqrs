import * as commands  from './commands.js'
import * as queries   from './queries.js'

import {
  responseOf,
  RESPONSE,
}                     from './action-pair.js'

type CQMod =
  & typeof commands
  & typeof queries

/**
 * Huan(202203): add suffix `Resonse` to the CommandQuery name:
 *  - getCurrentUserIdQuery -> getCurrentUserIdQueryResponse
 *
 * Changing Property Name in Typescript Mapped Type
 *  @link https://stackoverflow.com/a/63682391/1123955
 */
type ResponseMap = {
  [key in keyof CQMod & string as `${key}Response`]: CQMod[key][typeof RESPONSE]
}

const responses = Object.entries({
  ...commands,
  ...queries,
}).reduce(
  (acc, [key, actionPair]) => {
    acc[`${key}Response`] = responseOf(actionPair)
    return acc
  },
  {} as any,
) as ResponseMap

export const {
  dingCommandResponse,
  getAuthQrCodeQueryResponse,
  getCurrentUserIdQueryResponse,
  getIsLoggedInQueryResponse,
  getMessagePayloadQueryResponse,
  getSayablePayloadQueryResponse,
  resetCommandResponse,
  sendMessageCommandResponse,
  startCommandResponse,
  stopCommandResponse,
} = responses
