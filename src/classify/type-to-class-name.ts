import { pureTypeName  }          from './pure-type-name.js'
import { snakeToUpperCamelCase }  from './snake-to-upper-camel-case.js'

export const typeToClassName = <T extends string>(type: T) =>
  snakeToUpperCamelCase(
    pureTypeName(type),
  )
