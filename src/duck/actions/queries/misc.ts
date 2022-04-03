import { createAction }   from 'typesafe-actions'

import * as types                                   from '../../types/mod.js'
import { metaRequest, metaResponse, MetaResponse }  from '../../../cqr-event/meta.js'

/********************************************
 *
 * Puppet Properties
 *
 ********************************************/

/**
 * puppet.currentUserId
 */
const payloadGetCurrentUserIdQuery          = (_puppetId: string)                           => ({})
const payloadGetCurrentUserIdQueryResponse  = (res: MetaResponse & { contactId?: string })  => ({ contactId: res.contactId })

export const getCurrentUserIdQuery          = createAction(types.GET_CURRENT_USER_ID_QUERY,           payloadGetCurrentUserIdQuery,         metaRequest)()
export const getCurrentUserIdQueryResponse  = createAction(types.GET_CURRENT_USER_ID_QUERY_RESPONSE,  payloadGetCurrentUserIdQueryResponse, metaResponse)()

/**
 * puppet.authQrCode
 */
const payloadGetAuthQrCodeQuery         = (_puppetId: string)                       => ({})
const payloadGetAuthQrCodeQueryResponse = (res: MetaResponse & { qrcode?: string }) => ({ qrcode: res.qrcode })

export const getAuthQrCodeQuery         = createAction(types.GET_AUTH_QR_CODE_QUERY,          payloadGetAuthQrCodeQuery,          metaRequest)()
export const getAuthQrCodeQueryResponse = createAction(types.GET_AUTH_QR_CODE_QUERY_RESPONSE, payloadGetAuthQrCodeQueryResponse,  metaResponse)()

/**
 * puppet.isLoggedIn
 */
const payloadGetIsLoggedInQuery         = (_puppetId: string)                             => ({})
const payloadGetIsLoggedInQueryResponse = (res: MetaResponse & { isLoggedIn?: boolean })  => ({ isLoggedIn: res.isLoggedIn })

export const getIsLoggedInQuery         = createAction(types.GET_IS_LOGGED_IN_QUERY,          payloadGetIsLoggedInQuery,          metaRequest)()
export const getIsLoggedInQueryResponse = createAction(types.GET_IS_LOGGED_IN_QUERY_RESPONSE, payloadGetIsLoggedInQueryResponse,  metaResponse)()
