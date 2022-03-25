import type { ActionBuilder } from 'typesafe-actions'

/**
 * Huan(202203): We should use the below two Types for creating actions:
 *  1. MetaActionCreator: factory of `ActionBuilder`
 *  2. ActionBuilder: the payload interface of the action
 *    (this name is very confusing but its from the `typesafe-actio` library)
 */
export type MetaActionCreator <
  TType    extends string = string,
  TPayload extends {}     = {},
  TMeta    extends {}     = {},
  TArgs    extends any[]  = any[],
> = (...args: TArgs) => ActionBuilder<TType, TPayload, TMeta>
