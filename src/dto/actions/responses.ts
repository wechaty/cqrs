import { classifyMap }  from '../../classify/classify-map.js'
import * as commands    from '../../duck/actions/commands.js'
import * as queries     from '../../duck/actions/queries.js'

/**
 * Selective export for `Response` only
 */
export const {
  /**
   * Command Responses
   */
  DingCommandResponse,
  NopCommandResponse,
  ResetCommandResponse,
  SendMessageCommandResponse,
  StartCommandResponse,
  StopCommandResponse,
  /**
   * Query Responses
   */
  GetAuthQrCodeQueryResponse,
  GetCurrentUserIdQueryResponse,
  GetIsLoggedInQueryResponse,
  GetMessagePayloadQueryResponse,
  GetSayablePayloadQueryResponse,
} = classifyMap({
  ...commands,
  ...queries,
})
