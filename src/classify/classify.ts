

import * as actions from '../duck/actions/mod.js'

import { pureTypeName  }          from './pure-type-name.js'
import { snakeToUpperCamelCase }  from './snake-to-upper-camel-case.js'

type ActionBuilder = typeof actions[keyof typeof actions]

const command = actions.dingCommand

const Command = classify(command)



export const typeToClassName = <T extends string>(type: T) =>
  snakeToUpperCamelCase(
    pureTypeName(type),
  )

const classify = <T extends ActionBuilder> (actionBuilder: T) => {

  const type = actionBuilder.apply({} as any, [] as any)

  class PlainOldJavaScriptClass {

  }

  Reflect.defineProperty(PlainOldJavaScriptClass, 'name', {
    value: typeToClassName(
      command('a').type,
    ),
  })

  return PlainOldJavaScriptClass
}
