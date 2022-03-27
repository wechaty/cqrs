import * as TimeConstants   from 'time-constants'

import { packageJson }  from './package-json.js'

export const VERSION = packageJson.version || '0.0.0'
export const NAME    = packageJson.name    || 'NONAME'

/**
 * Huan(202203):
 *  how long to wait for the response from the bus$ after sending the query
 */
export const TIMEOUT_MS = 15 * TimeConstants.SECOND
