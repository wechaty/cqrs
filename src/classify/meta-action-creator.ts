import { createAction } from 'typesafe-actions'
// /**
//  * Fake function to get the generic typing of `createAction`
//  *
//  * SO: Typescript ReturnType of generic function
//  *  @link https://stackoverflow.com/a/62620115/1123955
//  */
// const FakeFunction = () => createAction<string, {}, {}>('any', () => ({}))()
// type ActionCreator = ReturnType<typeof FakeFunction>

/**
 * SO: TypeScript: Is it possible to get the return type of a generic function?
 *  @link https://stackoverflow.com/a/52964723/1123955
 */
class Helper <T extends string> {

  Return = createAction<
    T,
    {},
    {}
  >(
    'any' as any,
    () => ({}),
    () => ({}),
  )

}

export type MetaActionCreator<T extends string> = ReturnType<Helper<T>['Return']>
