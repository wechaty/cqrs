import {
  getType,
  ActionBuilder,
}                       from 'typesafe-actions'

import { classify }   from '../classify/classify.js'
import {
  Type,
  actions,
}                     from '../duck/mod.js'

import {
  responseOf,
  responseType,
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

export const getResponseCreatorByType = <T extends Type> (type: T) => {
  const creator = table[type]
  return responseOf(creator)
}

export const getResponseClassByType = <T extends Type> (type: T) => {
  const creator = table[type]
  const response = responseOf(creator)
  return classify(response)
}
