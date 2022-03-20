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

import { typeToClassName }        from './type-to-class-name.js'
import type { MetaActionCreator } from './meta-action-creator.js'

/**
 * Store the actionCreator & class for cache & singleton
 */
const singletonCache = new Map<
  MetaActionCreator<string>,
  Function
>()

/**
 * The typed ReturnType for `classify`
 */
export type ClassifiedConstructor<
  T extends MetaActionCreator<string>,
> = {
  new (...args: Parameters<T>): ReturnType<T>
  (...args: Parameters<T>): ReturnType<T>
} & ActionCreatorTypeMetadata<
  T extends MetaActionCreator<infer TType>
    ? TType
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
export const classify = <
  T extends MetaActionCreator<string>,
> (creator: T) => {

  /**
   * Check the cache for always return the same value for a creator
   */
  if (singletonCache.has(creator)) {
    return singletonCache.get(creator) as ClassifiedConstructor<T>
  }

  /**
   * SO: 'new' expression, whose target lacks a construct signature in TypeScript
   *  @link https://stackoverflow.com/a/43624326/1123955
   *  @example  `function () {} as unknown as { new (layerName: string): TestVectorLayer; }`
   */
  const PojoClass = function (this: ReturnType<T>, ...args: Parameters<T>) {
    const {
      type,
      meta,
      payload,
    } = (creator as any)(...args) // <- FIXME: remove `any` Huan(202203)

    this.type = type
    this.meta = meta
    this.payload = payload

    this.toString = () => type

    return this
  }

  const type = getType(creator)

  PojoClass.getType = () => type
  // redux-actions compatibility
  PojoClass.toString = () => type

  Reflect.defineProperty(PojoClass, 'name', {
    value: typeToClassName(type),
  })

  /**
   * Set cache for the future singleton
   */
  singletonCache.set(creator, PojoClass)

  return PojoClass as unknown as ClassifiedConstructor<T>
}
