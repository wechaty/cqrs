import type { ActionBuilder } from 'typesafe-actions'
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
// class Helper <
//   TType extends string,
//   TPayload extends {},
//   TMeta extends {}
// > {

//   Return = createAction<
//     TType,
//     TPayload,
//     TMeta
//   >(
//     'any' as any,
//     () => ({}) as any,
//     () => ({}) as any,
//   )

// }

// export type MetaActionCreator<
//   TType extends string,
//   TPayload extends {} = {},
//   TMeta extends {} = {}
// > = ReturnType<
//   Helper<TType, TPayload, TMeta>['Return']
// >

export type MetaActionCreator <
  TType    extends string = string,
  TPayload extends {}     = {},
  TMeta    extends {}     = {},
  TArgs    extends any[]  = any[],
> = (...args: TArgs) => ActionBuilder<TType, TPayload, TMeta>
