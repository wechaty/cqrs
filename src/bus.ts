/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
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
import type {
  Observable,
  Subject,
}                   from 'rxjs'
import type {
  ActionType,
}                   from 'typesafe-actions'

import type * as dto from './dto/mod.js'

// type BusSubject<T> = Subject<
//   ActionType<T>
// >

/**
 * Huan(202203): Use a simplified interface for Bus
 */
export interface Bus<T = ActionType<typeof dto.actions>> {
  asObservable : Subject<T>['asObservable']
  next         : Subject<T>['next']
  // complete     : Subject<T>['complete']
  // error        : Subject<T>['error']
  pipe         : Subject<T>['pipe']
  subscribe    : Subject<T>['subscribe']
}

export interface BusObs<T extends Observable<any>['pipe'] = Bus['pipe']> {
  pipe: T
}
