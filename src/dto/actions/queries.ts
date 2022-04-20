import { classifyMap }  from '../../classify/classify-map.js'
import * as queries     from '../../duck/actions/queries/mod.js'

/**
 * Selective export `Query` only
 */
export const {
  GetAuthQrCodeQuery,
  GetContactPayloadQuery,
  GetCurrentUserIdQuery,
  GetIsLoggedInQuery,
  GetMessagePayloadQuery,
  GetMessageFileQuery,
  GetRoomPayloadQuery,
  GetSayablePayloadQuery,
} = classifyMap(queries)
