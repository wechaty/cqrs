import {
  filter,
}               from 'rxjs/operators'
import {
  ActionCreator,
  isActionOf,
}               from 'typesafe-actions'

import { actions } from '../duck/mod.js'

import type { BusObs } from '../bus.js'

/**
 * Internal helper function
 */
const eventBus$ = <AC extends ActionCreator>(creator: AC) => (source$: BusObs) => source$.pipe(filter(isActionOf(creator)))

/**
 * Commands
 */
export const startCommand$         = eventBus$(actions.startCommand)
export const stopCommand$          = eventBus$(actions.stopCommand)

/**
 * Events
 */
export const startedEvent$         = eventBus$(actions.startedEvent)
export const stoppedEvent$         = eventBus$(actions.stoppedEvent)
export const scanReceivedEvent$    = eventBus$(actions.scanReceivedEvent)
export const messageReceivedEvent$ = eventBus$(actions.messageReceivedEvent)
