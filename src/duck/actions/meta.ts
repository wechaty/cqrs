/* eslint-disable sort-keys */
import UUID from 'uuid'

export interface MetaRequest {
  id       : string
  puppetId : string
}
/**
 * All commands/queries share this response
 *  It only shows that whether the function call has been put successfully
 *  There will be nothing related to the state change of the bot
 */
export type MetaResponse = MetaRequest & {
  gerror?  : string
}

export const metaRequest:   (puppetId: string, ..._: any) => MetaRequest  = puppetId  => ({ id: UUID.v4(), puppetId })
export const metaResponse:  (res: MetaResponse)           => MetaResponse = res       => ({ id: res.id, puppetId: res.puppetId, gerror: res.gerror })
