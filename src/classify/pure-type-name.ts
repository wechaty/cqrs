
export type PureTypeName<T extends string> = T extends `${string}/${infer P}` ? P : T

/**
 * Convert `wechaty-cqrs/DING_COMMAND` -> `DING_COMMAND` with static typing
 */
export const pureTypeName = <T extends string>(type: T) => (
  type.includes('/')
    ? type.substring(type.lastIndexOf('/') + 1)
    : type
) as PureTypeName<T>
