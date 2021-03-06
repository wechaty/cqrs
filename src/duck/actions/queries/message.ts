import type * as PUPPET   from 'wechaty-puppet'
import { createAction }   from 'typesafe-actions'

import * as types                                   from '../../types/mod.js'
import { metaRequest, metaResponse, MetaResponse }  from '../../../cqr-event/meta.js'

/**
 * puppet.messagePayload()
 */
const payloadGetMessagePayloadQuery         = (_puppetId: string, messageId: string)                      => ({ messageId })
const payloadGetMessagePayloadQueryResponse = (res: MetaResponse & { message?: PUPPET.payloads.Message }) => ({ message: res.message })

export const GET_MESSAGE_PAYLOAD_QUERY          = createAction(types.GET_MESSAGE_PAYLOAD_QUERY,           payloadGetMessagePayloadQuery,          metaRequest)()
export const GET_MESSAGE_PAYLOAD_QUERY_RESPONSE = createAction(types.GET_MESSAGE_PAYLOAD_QUERY_RESPONSE,  payloadGetMessagePayloadQueryResponse,  metaResponse)()

/**
 * puppet.messageFile()
 */
const payloadGetMessageFileQuery         = (_puppetId: string, messageId: string)   => ({ messageId })
const payloadGetMessageFileQueryResponse = (res: MetaResponse & { file?: string })  => ({ file: res.file })

export const GET_MESSAGE_FILE_QUERY           = createAction(types.GET_MESSAGE_FILE_QUERY,           payloadGetMessageFileQuery,          metaRequest)()
export const GET_MESSAGE_FILE_QUERY_RESPONSE  = createAction(types.GET_MESSAGE_FILE_QUERY_RESPONSE,  payloadGetMessageFileQueryResponse,  metaResponse)()
