import type * as commands   from './commands.js'
import type * as queries    from './queries.js'
import type * as responses  from './responses.js'
import type * as events     from './events.js'

export type CommandQuery =
  | InstanceType<typeof commands [keyof typeof commands]>
  | InstanceType<typeof queries  [keyof typeof queries]>

export type Response  = InstanceType<typeof responses [keyof typeof responses]>
export type Event     = InstanceType<typeof events    [keyof typeof events]>
