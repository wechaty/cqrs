import { classifyMap }  from '../classify/classify-map.js'
import * as responses   from '../duck/actions/responses.js'

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
} = classifyMap(responses)
