import 'reflect-metadata'

import type { ActionBuilder }   from 'typesafe-actions'
import {
  plainToInstance as classTransformer,
}                                       from 'class-transformer'

import { classify } from './classify.js'

/**
 * Convert an plain object to class object
 */
export const plainToInstance = (object: ActionBuilder<string, any, any>) => {
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
    console.info('classTransformer:', object.type, Klass)
    return classTransformer(Klass, object)
  }

  /**
   * type is not classifiable
   */
  return undefined
}
