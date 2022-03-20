import { classifyMap }  from '../classify/classify-map.js'
import * as queries     from '../duck/actions/queries.js'

export const {
  GetAuthQrCodeQuery,
  GetCurrentUserIdQuery,
  GetIsLoggedInQuery,
  GetMessagePayloadQuery,
  GetSayablePayloadQuery,
} = classifyMap(queries)
