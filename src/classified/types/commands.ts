import * as actions  from '../actions/commands.js'

import { getTypes }   from './get-types.js'

export const commands = getTypes(actions)
