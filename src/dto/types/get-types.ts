import { ActionCreator, getType } from 'typesafe-actions'

import { PureTypeName, pureTypeName } from '../../classify/pure-type-name.js'

export const getTypes = <
  ActionMap extends {
    [k: string]: ActionCreator<string>
  }
> (actions: ActionMap) => {

  type Action  = ActionMap[keyof ActionMap]
  type Type    = Action extends ActionCreator<infer TType> ? TType : never
  type TypeMap = {
    [K in Type as PureTypeName<K & string>]: K
  }

  return Object.values(actions).reduce((acc, command) => {
    const type = getType(command)
    acc[pureTypeName(type)] = type
    return acc
  }, {} as any) as TypeMap

}
