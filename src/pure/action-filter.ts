import type { Action } from 'typesafe-actions'

const actionTypeEndWith = <T extends string>(suffix: T) => function (
  action: Action<string>,
): action is Action<`${string}${T}`> {
  return RegExp(`${suffix}$`).test(action.type)
}

export const isCommand = actionTypeEndWith('_COMMAND')
export const isEvent   = actionTypeEndWith('_EVENT')
export const isMessage = actionTypeEndWith('_MESSAGE')
export const isQuery   = actionTypeEndWith('_QUERY')
