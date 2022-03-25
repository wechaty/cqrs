import { getType } from 'typesafe-actions'

import type { MetaActionCreator } from '../classify/meta-action-creator'

import * as duck from '../duck/mod.js'

type ActionMap = typeof duck.actions

export type TypeActionMap = {
  [K in keyof ActionMap as ActionMap[K] extends MetaActionCreator<infer TType> ? TType : never]: ActionMap[K]
}

/**
 * Store the actionCreator & class for cache & singleton
 */
export const typeActionMap: TypeActionMap = Object.entries(duck.actions).reduce((acc, [_, action]) => ({
  ...acc,
  [getType(action)]: action,
}), {} as any) as TypeActionMap
