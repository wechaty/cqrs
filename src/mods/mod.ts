import { packageJson }  from '../package-json.js'

export * as duck        from './duck.js'
export * as events$     from './events$.js'
export * as helpers     from './helpers.js'
export * as sayables    from './sayables.js'

export {
  from,
}                       from '../cqrs.js'
export {
  type Bus,
  type BusObs,
}                       from '../bus.js'
export { execute$ }     from '../execute$/mod.js'

export const VERSION = packageJson.version || '0.0.0'
export const NAME    = packageJson.name    || 'NONAME'
