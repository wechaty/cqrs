import _ from 'lodash'

import {
  classify,
  ClassifiedConstructor,
}                           from './classify.js'

import type { PayloadMetaActionFactory } from '../cqr-event/payload-meta-action-factory.js'
import { SnakeToUpperCamelCase, snakeToUpperCamelCase } from './snake-to-upper-camel-case.js'

/**
 * Convert an actionMap to a classMap
 */
export const classifyMap = <
  T extends Record<
    string,
    PayloadMetaActionFactory<string>
  >
> (actionMap: T) =>
  Object.entries(actionMap).reduce((acc, [ key, creator ]) => {
    /**
     * DING_COMMAND -> DingCommand
     */
    acc[snakeToUpperCamelCase(key)] = classify(creator)

    /**
     * dingCommand -> DingCommand
     */
    // acc[_.upperFirst(key)] = classify(creator)

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
    [
      K in keyof T as Capitalize<SnakeToUpperCamelCase<K & string>>
    ]: ClassifiedConstructor<T[K]>
  }
