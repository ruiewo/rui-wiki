export function assertExist<T>(params: T): asserts params is NonNullable<T> {
  if (params === null || params === undefined) {
    throw new Error("Assertion failed. params is null or undefined");
  }
}
