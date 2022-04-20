import type * as PUPPET   from 'wechaty-puppet'
import { createAction }   from 'typesafe-actions'

import * as types                                   from '../../types/mod.js'
import { metaRequest, metaResponse, MetaResponse }  from '../../../cqr-event/meta.js'

/**
 * puppet.roomPayload()
 */
const payloadGetRoomPayloadQuery         = (_puppetId: string, roomId: string)                      => ({ roomId })
const payloadGetRoomPayloadQueryResponse = (res: MetaResponse & { room?: PUPPET.payloads.Room }) => ({ room: res.room })

export const GET_ROOM_PAYLOAD_QUERY           = createAction(types.GET_ROOM_PAYLOAD_QUERY,           payloadGetRoomPayloadQuery,          metaRequest)()
export const GET_ROOM_PAYLOAD_QUERY_RESPONSE  = createAction(types.GET_ROOM_PAYLOAD_QUERY_RESPONSE,  payloadGetRoomPayloadQueryResponse,  metaResponse)()
