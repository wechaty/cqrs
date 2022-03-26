import type * as commandTypes from './types/commands.js'
import type * as queryTypes   from './types/queries.js'

import type * as commandActions from './actions/commands.js'
import type * as queryActions   from './actions/queries.js'

export type CQType =
  | typeof commandTypes [keyof typeof commandTypes]
  | typeof queryTypes   [keyof typeof queryTypes]

export type CQAction =
  | InstanceType<typeof commandActions[keyof typeof commandActions]>
  | InstanceType<typeof queryActions  [keyof typeof queryActions]>

export type { Type }  from './types/types.js'
export * as types     from './types/mod.js'
export * as actions   from './actions/mod.js'
