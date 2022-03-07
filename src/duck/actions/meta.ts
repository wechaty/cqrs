/* eslint-disable sort-keys */
import UUID from 'uuid'

/**
 * All commands/queries share this response
 *  It only shows that whether the function call has been put successfully
 *  it's nothing related to the state change of the bot
 */
export interface MetaResponse {
  gerror?  : string
  id       : string
  puppetId : string
}

export const metaRequest   = (puppetId: string, ..._: any)  => ({ id: UUID.v4(), puppetId })
export const metaResponse  = (res: MetaResponse)            => ({ id: res.id, puppetId: res.puppetId, gerror: res.gerror })
