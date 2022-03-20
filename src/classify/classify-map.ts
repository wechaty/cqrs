import {
  classify,
  ClassifiedConstructor,
}                           from './classify.js'

import type { MetaActionCreator } from './meta-action-creator.js'

/**
 * Convert an actionMap to a classMap
 */
export const classifyMap = <
  T extends Record<
    string,
    MetaActionCreator<string>
  >
> (actionMap: T) =>
  Object.entries(actionMap).reduce((acc, [key, creator]) => {
    acc[key] = classify(creator)
    return acc
  }, {} as any) as {
    [K in keyof T]: ClassifiedConstructor<T[K]>
  }
