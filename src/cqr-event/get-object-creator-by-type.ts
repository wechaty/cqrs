import {
  getType,
  ActionBuilder,
}                       from 'typesafe-actions'

import { ClassifiedConstructor, classify }   from '../classify/classify.js'
import {
  Type,
  actions,
}                     from '../duck/mod.js'

import {
  responseOf,
  responseType,
  RESPONSE,
}                     from './response.js'

/**
 * Huan(202203): Important to remember that creator is higher-order to builder (think about the creator is an architecture)
 *  - Creator is to create a Builder
 *  - Builder is created by Creator
 *  - Builder is to build an action payload
 *
 * ActionCreator<...> = (...args: any[]) => ActionBuilder<...>
 */

type ActionCreatorType<
  A extends (...args: any[]) => ActionBuilder<string, {}, {}>
> = A extends (...args: any[]) => ActionBuilder<infer T, any, any>
  ? T
  : never

/**
 * Huan(202003): Build a table with type as its key, creator as its value
 *
 *  actions.DingCommand         = ActionCreator
 *  ->
 *  actions[types.DING_COMMAND] = ActionCreator
 */
type TypeTable<
  M extends Record<string, any>
> = {
  [K in keyof M as string & ActionCreatorType<M[K]>]: M[K]
}

/**
 * Table for the `type` -> `creator` mapping
 */
const table = Object.values(actions).reduce((acc, cur) => {
  const type = getType(cur)
  acc[type] = cur
  return acc
}, {} as any) as TypeTable<typeof actions>

// type Type = keyof Table<typeof actions>

export const getCreatorByType = <T extends Type> (type: T) => table[type]
export const getClassByType   = <T extends Type> (type: T) => classify(table[type])

export const getResponseCreatorByType = <T extends Type> (type: T) => responseOf(table[type])
/**
 * Huan(202203):
 *  - FIXME: the below navie code not work, why?
 *  - FIXME: rename it to XXXAny, and use `as any` to make it work
 *
 *  Type 'typeof import("/home/huan/git/wechaty/cqrs/src/duck/actions/mod")[T]["Symbol('RESPONSE')"]' is not assignable to type 'string'.ts(2769)
 * @deprecated: fix the `any` issue before use it
 */
export const getResponseClassByTypeAny   = <T extends Type> (type: T) => classify(getResponseCreatorByType(type) as any)

/**
 * Huan(202203): workaround for the above not workable naive code
 */
export const getResponseClassByType = <
  T extends Type
> (type: T) => {
  const creator = table[type]
  type TT = typeof creator
  const r = (creator as any as TT)[RESPONSE]
  const response = responseOf(creator)
  return classify(response) as unknown as ClassifiedConstructor<typeof response>
}
