import 'reflect-metadata'

import type { ActionBuilder }   from 'typesafe-actions'
import {
  plainToClass as classTransformer,
}                                   from 'class-transformer'

import { classify } from './classify.js'

/**
 * Convert an plain object to class object
 */
export const plainToClass = (object: ActionBuilder<string, any, any>) => {
  /**
   * 1. class object (already)
   *  Huan(202203): double confirm this logic is correct for identify the plain object
   */
  if (Object.getPrototypeOf(object) !== Object.prototype) return object

  /**
   * 2. plain object (with supported type)
   */
  const Klass = classify(object.type)
  if (Klass) { // not found
    return classTransformer(Klass, object)
  }

  /**
   * type is not classifiable
   */
  return undefined
}
