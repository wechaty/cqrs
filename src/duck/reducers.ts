/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type { AnyAction } from 'redux'
import {
  createReducer,
}                     from 'typesafe-actions'
import type {
  DeepReadonly,
}                     from 'utility-types'

import * as actionFilter from '../pure/action-filter.js'

import * as actions from './actions/mod.js'

interface Counter {
  commands : number
  events   : number
  messages : number
  queries  : number
}

type State = DeepReadonly<{
  counter: {
    total: Counter
    [puppetId: string]: undefined | Counter
  }
}>

const initialState: State = {
  counter  : {
    total: {
      commands : 0,
      events   : 0,
      messages : 0,
      queries  : 0,
    },
  },
}

const reducer = createReducer<typeof initialState, AnyAction>(initialState)
  .handleAction(Object.values(actions), (state, action) => {
    const totalCounter = {
      ...state.counter.total,
    }
    const puppetCounter = {
      commands : 0,
      events   : 0,
      messages : 0,
      queries  : 0,
      ...state.counter[action.meta.puppetId],
    }

    if (actionFilter.isCommand(action)) {
      totalCounter.commands++
      puppetCounter.commands++
    } else if (actionFilter.isEvent(action)) {
      totalCounter.events++
      puppetCounter.events++
    } else if (actionFilter.isMessage(action)) {
      totalCounter.messages++
      puppetCounter.messages++
    } else if (actionFilter.isQuery(action)) {
      totalCounter.queries++
      puppetCounter.queries++
    }

    const newState: State = {
      ...state,
      counter: {
        ...state.counter,
        total: totalCounter,
        [action.meta.puppetId]: puppetCounter,
      },
    }

    return newState
  })

export type {
  State,
}
export default reducer
