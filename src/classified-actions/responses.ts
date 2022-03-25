import { classifyMap }  from '../classify/classify-map.js'
import * as commands    from '../duck/actions/commands.js'
import * as queries     from '../duck/actions/queries.js'

/**
 * Selective export for `Response` only
 */
export const {
  DingCommandResponse,
  GetAuthQrCodeQueryResponse,
  GetCurrentUserIdQueryResponse,
  GetIsLoggedInQueryResponse,
  GetMessagePayloadQueryResponse,
  GetSayablePayloadQueryResponse,
  ResetCommandResponse,
  SendMessageCommandResponse,
  StartCommandResponse,
  StopCommandResponse,
} = classifyMap({
  ...commands,
  ...queries,
})
