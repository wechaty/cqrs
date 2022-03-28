import { isActionOf }   from 'typesafe-actions'

/**
 * check if an action is the instance of given action-creator(s)
 *  (curried assert function)
 */
export const is: (...args: Parameters<typeof isActionOf>) => ReturnType<typeof isActionOf> = (...args) => isActionOf(...args)
