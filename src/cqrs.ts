import type * as WECHATY from 'wechaty'
import * as PUPPET from 'wechaty-puppet'

import {
  Subject,
}               from 'rxjs'
import type {
  Action,
}             from 'redux'

import {
  WechatyRedux,
}                   from 'wechaty-redux'
import * as Duck    from './duck/mod.js'

import {
  filterCommandType,
  filterEventType,
  filterQueryType,
}                     from './pure/filter-type.js'

function cqrsWechaty (
  wechaty: WECHATY.impls.WechatyInterface,
) {
  const bus$ = new Subject<Action>()

  const command$ = bus$.pipe(filterCommandType)
  const event$   = bus$.pipe(filterEventType)
  const query$   = bus$.pipe(filterQueryType)

  const store = {
    bus$: bus$,
  } as any

  wechaty.use(
    WechatyRedux({ store }),
  )

  return bus$
}

export {
  cqrsWechaty,
}
