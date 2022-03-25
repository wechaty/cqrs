import _ from 'lodash'

import {
  classify,
  ClassifiedConstructor,
}                           from './classify.js'

import type { MetaActionCreator } from '../cqr-event/meta-action-creator.js'

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
    acc[_.upperFirst(key)] = classify(creator)
    return acc
  }, {} as any) as {
    /**
     * SO: Convert nested properties
     *  @link https://stackoverflow.com/a/65642944/1123955
     *
     * Huan(202203): Map the object key name from
     *  `sendMessageCommand` to `SendMessageCommand`
     *  by capitalizing the first letter of the first word.
     */
    [K in keyof T as Capitalize<K & string>]: ClassifiedConstructor<T[K]>
  }
