import * as commands  from './commands.js'
import * as queries   from './queries.js'

import {
  responseActionOf,
  RESPONSE,
}                     from './create-action-pair.js'

type CQMod =
  & typeof commands
  & typeof queries

// type ResponseableMap = {
//   [key in keyof CQMod]: Responseable<
//     CQMod[key] extends Responseable<infer RType, any, any> ? RType : never,
//     CQMod[key] extends Responseable<any, infer RPayload, any>   ? RPayload  : never,
//     CQMod[key] extends Responseable<any, any, infer RResponse>  ? RResponse : never
//   >
// }

// type Response<T extends Responseable<any, any, any>> = T[typeof RESPONSE]

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

export const responses = Object.entries({
  ...commands,
  ...queries,
}).reduce(
  (acc, [key, actionPair]) => {
    acc[`${key}Response`] = responseActionOf(actionPair)
    return acc
  },
  {} as any,
) as ResponseMap
