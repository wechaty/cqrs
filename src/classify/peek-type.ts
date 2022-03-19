import type * as actions from '../duck/actions/mod.js'

type ActionBuilder = typeof actions[keyof typeof actions]

export const peekType = <T extends ActionBuilder> (action: T) => (action as any)({}).type as ReturnType<T>['type']
