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
/**
 * We add `_RESPONSE` to the end of the `type` for the Response Event for Command/Query
 */
const _RESPONSE = '_RESPONSE'
export type ResponseType<T extends string> = `${T}${typeof _RESPONSE}`
export const responseType = <T extends string> (type: T) => `${type}${_RESPONSE}` as ResponseType<T>

/**
 * Deal with a map object {}
 */
export type ResponseTypeMap<T extends { [key: string]: string }> = {
  [K in keyof T as ResponseType<string & K>]: ResponseType<T[K]>
}
export const responseTypeMap = <T extends { [key: string]: string }> (o: T) =>
  Object.entries(o).reduce((acc, [ key, val ]) => {
    const k = responseType(key)
    const v = responseType(val)
    acc[k] = v
    return acc
  }, {} as any) as ResponseTypeMap<T>
