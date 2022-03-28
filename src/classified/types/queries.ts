import * as actions  from '../actions/queries.js'

import { getTypes }   from './get-types.js'

export const queries = getTypes(actions)
