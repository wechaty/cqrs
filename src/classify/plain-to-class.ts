import 'reflect-metadata'

import type { PayloadMetaAction }   from 'typesafe-actions'
import {
  plainToClass as classTransformer,
}                                   from 'class-transformer'

import { classify } from './classify.js'

/**
 * Convert an plain object to class object
 */
export const plainToClass = (object: PayloadMetaAction<string, any, any>) => {
  /**
   * 1. class object (already)
   *  Huan(202203): double confirm this logic is correct for identify the plain object
   */
  if (Object.getPrototypeOf(object) !== Object.prototype) return object

  /**
   * 2. plain object
   */
  const Klass = classify(object.type)
  if (!Klass) { // not found
    return object
  }
  return classTransformer(Klass, object)
}
