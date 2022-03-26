import { ActionCreatorTypeMetadata, getType } from 'typesafe-actions'

import { PureTypeName, pureTypeName } from '../../classify/pure-type-name.js'

import * as actions from '../actions/mod.js'

export type Type = typeof actions[keyof typeof actions] extends ActionCreatorTypeMetadata<infer TType> ? TType : never

type TypeMap = {
  [T in Type as PureTypeName<T>]: T
}

export const types = Object.values(actions).reduce((acc, action) => {
  const type = getType(action)
  acc[pureTypeName(type)] = type
  return acc
}, {} as any) as TypeMap
