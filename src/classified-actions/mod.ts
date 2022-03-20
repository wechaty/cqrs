/**
 * Huan(202203):
 *  The `classify()` call is required before using the classify() method with string types
 *  because the cache/registery need to be set before use the string `type` parameter.
 */
export * as commands  from './commands.js'
export * as events    from './events.js'
export * as queries   from './queries.js'
export * as responses from './responses.js'
