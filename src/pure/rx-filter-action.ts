import type {
  Action,
}               from 'redux'
import {
  filter,
}               from 'rxjs/operators'

export const filterTypeEndWith = <T extends string>(suffix: T) => {
  const regex = RegExp(`${suffix}$`)
  function predict (action: Action): action is Action<`${string}${T}`> {
    return regex.test(action.type)
  }
  return filter<Action, Action<`${string}${T}`>>(predict)
}

export const filterCommand  = () => filterTypeEndWith('_COMMAND')
export const filterEvent    = () => filterTypeEndWith('_EVENT')
export const filterResponse = () => filterTypeEndWith('_RESPONSE')
export const filterQuery    = () => filterTypeEndWith('_QUERY')
