/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  ActionCreatorTypeMetadata,
  getType,
}                             from 'typesafe-actions'
import { log }                from 'wechaty-puppet'

import type * as duck                     from '../duck/mod.js'
import type { PayloadMetaActionFactory }  from '../cqr-event/payload-meta-action-factory.js'

import { typeToClassName }        from './type-to-class-name.js'

/**
 * Store the actionCreator & class for cache & singleton
 */
const singletonCache = new Map<
  string,
  Function
>()

/**
 * The typed ReturnType for `classify`
 */
export type ClassifiedConstructor<
  T extends PayloadMetaActionFactory<string> = PayloadMetaActionFactory<string>,
> = {
  new (...args: Parameters<T>): ReturnType<T>
  /**
   * Huan(202203): the below call-able definition
   *  is for compatible with the `isActionOf` typesafe-actions function
   */
  (...args: Parameters<T>): ReturnType<T>
} & ActionCreatorTypeMetadata<
  T extends PayloadMetaActionFactory<infer TType>
    ? TType
    : never
>

/**
 * 1. Get the class from the actionCreator
 */
export function classify <
  T extends PayloadMetaActionFactory
> (
  creator: T,
): ClassifiedConstructor<T>

/**
 * 2. Get the class from the type string
 */
export function classify <
  TType extends string,
  A extends typeof duck.actions[keyof typeof duck.actions]
> (
  type: TType,
): undefined | ClassifiedConstructor<
  A extends PayloadMetaActionFactory<TType, infer TPayload, infer TMeta, infer TArgs>
    ? TPayload extends {}
      ? TMeta extends {}
        ? TArgs extends any[]
          ? PayloadMetaActionFactory<TType, TPayload, TMeta, TArgs>
          : never
        : never
      : never
    : never
>

/**
 * Convert a typesafe-actions `ActionCreatorBuilder` to a new-able `Class`
 *  and keep the data structure as close to the original as possible.
 *  to make the class a Plain Old JavaScript Object (POJO) & Data Translate Object (DTO)
 *
 * Issue: Compatible with Class events with NestJS #1
 *  @link https://github.com/wechaty/cqrs/issues/1
 */
export function classify <
  T extends string,
  TPayload extends {},
  TMeta extends {},
  // TArgs extends any[],
  C extends PayloadMetaActionFactory<T, TPayload, TMeta>
> (typeOrActionCreator?: T | C) {

  if (!typeOrActionCreator) {
    log.warn('WechatyCqrs', 'classify() no action provided')
    return undefined
  }

  /**
   * 1. Deal with string type
   */
  if (typeof typeOrActionCreator === 'string') {
    if (singletonCache.has(typeOrActionCreator)) {
      return singletonCache.get(typeOrActionCreator) as ClassifiedConstructor<PayloadMetaActionFactory<T>>
    }
    // throw new Error(`[${action}] action not exist in singletonCache, please check whether the module has been imported before use`)
    log.warn('WechatyCqrs', 'classify(%s) not exist in cache, please check whether the module has been imported before use', typeOrActionCreator)
    return undefined
  }

  /**
   * 2. Deal with Typesafe Actions type
   */
  const type = getType(typeOrActionCreator)

  /**
   * Check the cache for always return the same value for a creator
   */
  if (singletonCache.has(type)) {
    return singletonCache.get(type) as ClassifiedConstructor<PayloadMetaActionFactory<T>>
  }

  /**
   * SO: 'new' expression, whose target lacks a construct signature in TypeScript
   *  @link https://stackoverflow.com/a/43624326/1123955
   *  @example  `function () {} as unknown as { new (layerName: string): TestVectorLayer; }`
   */
  const PojoClass = function (
    this: undefined | ReturnType<C>,
    ...args: Parameters<C>
  ) {
    /**
     * Huan(202203): Compatible with `PojoClass(...args)` call
     *  with the same effect as the `new PojoClass(...args)`
     *
     * The below three lines are equivalent:
     *  1. const instance = new PojoClass(...args)
     *  2. const instance = PojoClass(...args)
     *  3. const instance = commands.PojoClass(...args) // this has an invalid `this` passed in
     */
    if (!this || !(this instanceof PojoClass)) {
      return new (PojoClass as any)(...args)
    }

    const {
      meta,
      payload,
    } = typeOrActionCreator(...args)

    this.type    = type
    this.meta    = meta
    this.payload = payload

    this.toString = function toString () { return type }

    return this
  }

  PojoClass.getType = () => type
  // redux-actions compatibility
  PojoClass.toString = function toString () { return type }

  Reflect.defineProperty(PojoClass, 'name', {
    value: typeToClassName(type),
  })

  /**
   * Set cache for the future singleton
   */
  singletonCache.set(type, PojoClass)
  log.silly('WechatyCqrs', 'classify(%s) cache set', type)

  return PojoClass as unknown as ClassifiedConstructor<PayloadMetaActionFactory<T>>
}
