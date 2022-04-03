import { classifyMap }  from '../../classify/classify-map.js'
import * as queries     from '../../duck/actions/queries/mod.js'

/**
 * Selective export `Query` only
 */
export const {
  GetAuthQrCodeQuery,
  GetCurrentUserIdQuery,
  GetIsLoggedInQuery,
  GetMessagePayloadQuery,
  GetSayablePayloadQuery,
} = classifyMap(queries)
