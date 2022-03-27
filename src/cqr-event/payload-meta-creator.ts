import type { PayloadMetaAction } from 'typesafe-actions'

/**
 * Huan(202203): We should use the below two Types for creating actions:
 *  1. PayloadMetaCreator: factory of `PayloadMetaAction`
 *  2. PayloadMetaAction(ActionBuilder): the payload interface of the action
 *    (this name is very confusing but its from the `typesafe-action` library)
 */
export type PayloadMetaCreator <
  TType    extends string = string,
  TPayload extends {}     = {},
  TMeta    extends {}     = {},
  TArgs    extends any[]  = any[],
> = (...args: TArgs) => PayloadMetaAction<TType, TPayload, TMeta>
