import type * as PUPPET   from 'wechaty-puppet'
import { createAction }   from 'typesafe-actions'

import * as types                                   from '../../types/mod.js'
import { metaRequest, metaResponse, MetaResponse }  from '../../../cqr-event/meta.js'

/**
 * puppet.contactPayload()
 */
const payloadGetContactPayloadQuery         = (_puppetId: string, contactId: string)                      => ({ contactId })
const payloadGetContactPayloadQueryResponse = (res: MetaResponse & { contact?: PUPPET.payloads.Contact }) => ({ contact: res.contact })

export const GET_CONTACT_PAYLOAD_QUERY          = createAction(types.GET_CONTACT_PAYLOAD_QUERY,           payloadGetContactPayloadQuery,          metaRequest)()
export const GET_CONTACT_PAYLOAD_QUERY_RESPONSE = createAction(types.GET_CONTACT_PAYLOAD_QUERY_RESPONSE,  payloadGetContactPayloadQueryResponse,  metaResponse)()
