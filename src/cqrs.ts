import type * as WECHATY from 'wechaty'
import {
  Ducks,
  nopReducer,
}                   from 'ducks'
import {
  Subject,
}                   from 'rxjs'
import {
  createStore,
  Middleware,
  compose,
  applyMiddleware,
}                   from 'redux'

import {
  WechatyRedux,
}                   from 'wechaty-redux'
import type {
  ActionType,
}                   from 'typesafe-actions'

import * as CqrsDuck    from './duck/mod.js'

export type Bus<T = typeof CqrsDuck.actions> = Subject<
  ActionType<T>
>

/**
 * Input: Commands & Queries
 */
const cqMiddleware: (cqBus$: Bus) => Middleware = cqBus$ => _store => next => {
  cqBus$.subscribe(cq => {
    // console.info('bus$.subscribe e:', cq)
    next(cq)
    // console.info('bus$.subscribe e: done.')
  })
  return action => next(action)
}

/**
 * Output: Messages & Events
 */
const meMiddleware: (meBus$: Bus) => Middleware = meBus$ => _store => next => action => {
  meBus$.next(action)
  // console.info('action:', action)
  next(action)
}

export function from (
  wechaty: WECHATY.impls.WechatyInterface,
): Bus {
  const cqBus$ = new Subject<any>()
  const meBus$ = new Subject<any>()

  const ducks = new Ducks({ cqrs: CqrsDuck })
  const store = createStore(
    nopReducer,
    compose(  // Composes functions from right to left.
      applyMiddleware(
        /**
         * Huan(202203): cq - Commands & Queries
         *  `cqMiddleware` MUST be the most left one when calling `compose`
         *
         * to guarantee: send events to other middlewares
         */
        cqMiddleware(cqBus$),
      ),
      ducks.enhancer(),
      applyMiddleware(
        /**
         * Huan(202203): me - Messages & Events
         *  `meMiddleware` MUST be the most right one when calling `compose`
         *
         * to guarantee that: receive events generated from other middlewares
         */
        meMiddleware(meBus$),
      ),
    ),
  )

  wechaty.use(
    WechatyRedux({ store }),
  )

  // const cqrsDuck = ducks.ducksify('cqrs')
  // cqrsDuck.operations.ding(wechaty.puppet.id)

  const bus$: Bus = Subject.create(cqBus$, meBus$)

  return bus$
}
