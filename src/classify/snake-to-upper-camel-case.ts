import _ from 'lodash'
/**
 * A List of Different Case Types
 *  @link https://danielmiessler.com/blog/a-list-of-different-case-types
 *
 * - CamelCase:         Words are written without spaces, and the first letter of each word is capitalized. Also called Upper Camel Case or Pascal Casing.
 * - lowerCamelCase:    A variation of Camel Case in which the fist letter of the word is lowercase, e.g. iPhone, iPad, etc.
 * - SNAKE_CASE:        Punctuation is removed and spaces are replaced by a single underscore. Can be done with either upper or lowercase, but whichever is used should continue to be used.
 * - lower_snake_case: ...
 */

/**
 * SO: TypeScript convert generic object from snake to camel case
 *  @link https://stackoverflow.com/a/65642944/1123955
 */
export type SnakeToUpperCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Capitalize<Lowercase<T>>}${Capitalize<SnakeToUpperCamelCase<Lowercase<U>>>}`
    : S

/**
 * SNAKE_CASE -> UpperCamelCase
 */
export const snakeToUpperCamelCase = <T extends string> (str: T) => _.upperFirst(_.camelCase(str)) as Capitalize<SnakeToUpperCamelCase<T>>
