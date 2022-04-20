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
export const START_COMMAND$ = eventBus$(actions.START_COMMAND)
export const STOP_COMMAND$  = eventBus$(actions.STOP_COMMAND)

/**
 * Events
 */
export const STARTED_EVENT$          = eventBus$(actions.STARTED_EVENT)
export const STOPPED_EVENT$          = eventBus$(actions.STOPPED_EVENT)
export const SCAN_RECEIVED_EVENT$    = eventBus$(actions.SCAN_RECEIVED_EVENT)
export const MESSAGE_RECEIVED_EVENT$ = eventBus$(actions.MESSAGE_RECEIVED_EVENT)
