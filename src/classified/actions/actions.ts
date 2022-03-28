import * as commands   from './commands.js'
import * as queries    from './queries.js'
import * as responses  from './responses.js'
import * as events     from './events.js'

export const actions = {
  ...commands,
  ...queries,
  ...responses,
  ...events,
}

export type Action = typeof actions[keyof typeof actions]
