import type * as WECHATY from 'wechaty'
import {
  Ducks,
  nopReducer,
}                   from 'ducks'
import {
  Subject,
}               from 'rxjs'
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

export type CqrsBus = Subject<
  ActionType<typeof CqrsDuck.actions>
>

const cqrsMiddleware: (bus$: CqrsBus) => Middleware = bus$ => _store => next => {
  bus$.subscribe(next)
  return action => bus$.next(action)
}

export function from (
  wechaty: WECHATY.impls.WechatyInterface,
): CqrsBus {
  const bus$: CqrsBus = new Subject()

  const ducks = new Ducks({ cqrs: CqrsDuck })
  const store = createStore(
    nopReducer,
    compose(  // Composes functions from right to left.
      ducks.enhancer(),
      applyMiddleware(
        cqrsMiddleware(bus$),
      ),
    ),
  )

  wechaty.use(
    WechatyRedux({ store }),
  )

  // const cqrsDuck = ducks.ducksify('cqrs')
  // cqrsDuck.operations.ding(wechaty.puppet.id)

  return bus$
}
