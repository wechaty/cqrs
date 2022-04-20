import type * as PUPPET   from 'wechaty-puppet'
import { createAction }   from 'typesafe-actions'

import * as types                                   from '../../types/mod.js'
import { metaRequest, metaResponse, MetaResponse }  from '../../../cqr-event/meta.js'

/**
 * puppet.sayablePayload()
 */
const payloadGetSayablePayloadQuery         = (_puppetId: string, sayableId: string)                      => ({ sayableId })
const payloadGetSayablePayloadQueryResponse = (res: MetaResponse & { sayable?: PUPPET.payloads.Sayable }) => ({ sayable: res.sayable })

export const GET_SAYABLE_PAYLOAD_QUERY          = createAction(types.GET_SAYABLE_PAYLOAD_QUERY,           payloadGetSayablePayloadQuery,          metaRequest)()
export const GET_SAYABLE_PAYLOAD_QUERY_RESPONSE = createAction(types.GET_SAYABLE_PAYLOAD_QUERY_RESPONSE,  payloadGetSayablePayloadQueryResponse,  metaResponse)()
