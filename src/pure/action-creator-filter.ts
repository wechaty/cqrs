import type { ActionCreator } from 'typesafe-actions/dist/is-action-of.js'

const actionCreatorTypeEndWith = <T extends string>(suffix: T) => function (
  actionCreator: ActionCreator<{ type: string }>,
): actionCreator is ActionCreator<{ type: `${string}${T}` }> {
  return RegExp(`${suffix}$`).test(actionCreator.getType!())
}

export const isCommand = actionCreatorTypeEndWith('_COMMAND')
export const isEvent   = actionCreatorTypeEndWith('_EVENT')
export const isMessage = actionCreatorTypeEndWith('_MESSAGE')
export const isQuery   = actionCreatorTypeEndWith('_QUERY')
