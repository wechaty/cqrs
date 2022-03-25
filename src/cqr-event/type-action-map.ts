import { getType } from 'typesafe-actions'

import type { MetaActionCreator } from '../classify/meta-action-creator'

import * as duck from '../duck/mod.js'

type ActionMap = typeof duck.actions

/**
 * Huan(202003): Build a table with type as its key, creator as its value
 *
 *  actions.DingCommand         = ActionCreator
 *  ->
 *  actions[types.DING_COMMAND] = ActionCreator
 */
export type TypeActionMap = {
  [K in keyof ActionMap as ActionMap[K] extends MetaActionCreator<infer TType> ? TType : never]: ActionMap[K]
}

/**
 * Store the actionCreator & class for cache & singleton
 *
 * Table for the `type` -> `creator` mapping
 */
export const typeActionMap: TypeActionMap = Object.entries(duck.actions).reduce((acc, [_, action]) => ({
  ...acc,
  [getType(action)]: action,
}), {} as any) as TypeActionMap
