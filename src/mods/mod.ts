import { packageJson }  from '../package-json.js'

export * as duck        from './duck.js'
export * as helpers     from './helpers.js'
export * as sayables    from './sayables.js'

export {
  type Bus,
  from,
}                       from '../cqrs.js'

export const VERSION = packageJson.version || '0.0.0'
export const NAME    = packageJson.name    || 'NONAME'
