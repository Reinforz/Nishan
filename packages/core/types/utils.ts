export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never
export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean | void | null | undefined;
