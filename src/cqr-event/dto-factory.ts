import type { Type }  from '../classified/mod.js'

import { typeActionMap }  from './type-action-map.js'

export const dtoFactory = <T extends Type> (type: T) => typeActionMap[type]
