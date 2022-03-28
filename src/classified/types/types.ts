import { commands }   from './commands.js'
import { queries }    from './queries.js'
import { responses }  from './responses.js'
import { events }     from './events.js'

export const types = {
  ...commands,
  ...queries,
  ...responses,
  ...events,
}

export type Type = typeof types[keyof typeof types]
