import type * as dto  from '../dto/mod.js'

import { typeActionMap }  from './type-action-map.js'

export const dtoFactory = <T extends dto.types.Type> (type: T) => typeActionMap[type]
