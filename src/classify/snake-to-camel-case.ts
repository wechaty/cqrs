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
 * SO: Is it possible to use mapped types in Typescript to change a types key names?
 *  @link https://stackoverflow.com/a/64933956/1123955
 */
type SnakeToCamel<T extends string, P extends string = ''> =
string extends T ? T :
T extends `_${infer C0}${infer R}`
  ? SnakeToCamel<
      R,
      `${P}${Uppercase<C0>}`
    >
  : T extends `${infer C0}${infer R}`
    ? SnakeToCamel<
        R,
        `${P}${Lowercase<C0>}`
      >
    : P

/**
 * SNAKE_CASE -> CamelCase
 */
export const snakeToCamelCase = <T extends string> (str: T) => _.camelCase(str) as Capitalize<SnakeToCamel<T>>

  // /**
  //  * CamelCase -> SNAKE_CASE
  //  */
  // const camelCaseToSnakeCase = (str: string) => {
  //   snakeCase(str)
  // }

