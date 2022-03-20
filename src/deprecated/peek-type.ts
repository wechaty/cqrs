import type * as actions from '../duck/actions/mod.js'

type ActionBuilder = typeof actions[keyof typeof actions]

/**
 * @deprecated use `getType()` from typesafe-actions instead
 */
export const peekType = <T extends ActionBuilder> (action: T) => (action as any)({}).type as ReturnType<T>['type']
