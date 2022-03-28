import type { commands }  from './commands.js'
import type { queries  }  from './queries.js'

export type CQ =
  | typeof commands [keyof typeof commands]
  | typeof queries  [keyof typeof queries]
