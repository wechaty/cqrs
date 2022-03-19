import type * as actions from '../duck/actions/mod.js'
import { peekType } from './peek-type.js'

import { typeToClassName } from './type-to-class-name.js'

type ActionBuilder = typeof actions[keyof typeof actions]

/**
 * Convert a typesafe-actions `ActionCreatorBuilder` to a new-able `Class`
 *  and keep the data structure as close to the original as possible.
 *  to make the class a Plain Old JavaScript Object (POJO) & Data Translate Object (DTO)
 *
 * Issue: Compatible with Class events with NestJS #1
 *  @link https://github.com/wechaty/cqrs/issues/1
 */
export const classify = <
  T extends ActionBuilder,
  TArgs extends Parameters<T>
> (actionBuilder: T) => {
  /**
   * SO: 'new' expression, whose target lacks a construct signature in TypeScript
   *  @link https://stackoverflow.com/a/43624326/1123955
   *  @example  `function () {} as unknown as { new (layerName: string): TestVectorLayer; }`
   */
  const PojoClass = function (this: ReturnType<T>, ...args: TArgs) {
    const {
      type,
      meta,
      payload,
    } = (actionBuilder as any)(...args) // <- FIXME: remove `any` Huan(202203)

    this.type = type
    this.meta = meta
    this.payload = payload
  }

  Reflect.defineProperty(PojoClass, 'name', {
    value: typeToClassName(
      peekType(actionBuilder),
    ),
  })

  return PojoClass as unknown as { new (...args: TArgs): ReturnType<T> }
}
