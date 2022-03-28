import type * as commands  from './commands.js'
import type * as queries   from './queries.js'

export type CQ =
  | InstanceType<typeof commands [keyof typeof commands]>
  | InstanceType<typeof queries  [keyof typeof queries]>
