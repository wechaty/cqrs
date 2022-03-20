import type { PayloadMetaActionCreator } from 'typesafe-actions'
import {
  classify,
  ClassifiedConstructor,
}                           from './classify.js'

/**
 * Convert an actionMap to a classMap
 */
export const classifyMap = <
  T extends Record<
    string,
    PayloadMetaActionCreator<string, any, any>
  >
> (actionMap: T) =>
  Object.entries(actionMap).reduce((acc, [key, creator]) => {
    acc[key] = classify(creator)
    return acc
  }, {} as any) as {
    [K in keyof T]: ClassifiedConstructor<T[K]>
  }
