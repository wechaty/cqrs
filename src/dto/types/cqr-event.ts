import type { commands }   from './commands.js'
import type { queries }    from './queries.js'
import type { responses }  from './responses.js'
import type { events }     from './events.js'

export type CommandQuery =
  | typeof commands [keyof typeof commands]
  | typeof queries  [keyof typeof queries]

export type Response  = typeof responses  [keyof typeof responses]
export type Event     = typeof events     [keyof typeof events]
