import 'reflect-metadata'

import type { PayloadMetaAction }   from 'typesafe-actions'

import { classify }  from './classify.js'

/**
 * Convert an plain object to class object
 */
export const plainToInstance = <
  TType extends string
> (object: PayloadMetaAction<TType, any, any>) => {
  /**
   * 1. class object (already)
   *  Huan(202203): double confirm this logic is correct for identify the plain object
   */
  if (Object.getPrototypeOf(object) !== Object.prototype) return object

  /**
   * 2. plain object (with supported type)
   */
  const Klass = classify(object.type)

  if (Klass) {
    /**
     * Create an new object for converting it to the class object
     *  and keep the original object to be immutable.
     *
     * Or the redux will claim: "Actions must be plain objects."
     *
     */
    return Object.setPrototypeOf({ ...object }, Klass.prototype)
  }

  /**
   * type is not classifiable
   */
  return undefined
}
