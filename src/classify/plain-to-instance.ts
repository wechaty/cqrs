import 'reflect-metadata'

import type { PayloadMetaAction }                       from 'typesafe-actions'
import { plainToInstance as classInstanceTransformer }  from 'class-transformer'

import { ClassifiedConstructor, classify } from './classify.js'
import type { PayloadMetaActionFactory } from '../cqr-event/payload-meta-action-factory.js'

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
  const Klass = classify(object.type) as unknown as
    /**
     * Huan(202203): FIXME: remove the `as unknown as ...` by correcting the typing system
     */
    | undefined
    | ClassifiedConstructor<PayloadMetaActionFactory<TType>>

  if (Klass) {
    return classInstanceTransformer(Klass, object)
  }

  /**
   * type is not classifiable
   */
  return undefined
}
