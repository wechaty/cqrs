import {
  filter,
}               from 'rxjs/operators'
import {
  isActionOf,
}               from 'typesafe-actions'

import { actions } from '../duck/mod.js'

import type { BusObs } from '../bus.js'

export const startedEvent$         = (source$: BusObs) => source$.pipe(filter(isActionOf(actions.startedEvent)))
export const stoppedEvent$         = (source$: BusObs) => source$.pipe(filter(isActionOf(actions.stoppedEvent)))
export const scanReceivedEvent$    = (source$: BusObs) => source$.pipe(filter(isActionOf(actions.scanReceivedEvent)))
export const messageReceivedEvent$ = (source$: BusObs) => source$.pipe(filter(isActionOf(actions.messageReceivedEvent)))
