import { HandleError } from "./handleErr";

export function wrapClassMethods<T extends object>(instance: T): T {
  const instanceMethodNames = Object.getOwnPropertyNames(instance).filter(
    (name) => typeof (instance as any)[name] === "function"
  );

  const prototype = Object.getPrototypeOf(instance);
  const prototypeMethodNames = Object.getOwnPropertyNames(prototype).filter(
    (name) =>
      typeof prototype[name] === "function" && name !== "constructor"
  );

  const methodNames = [...new Set([...instanceMethodNames, ...prototypeMethodNames])];


  for (const name of methodNames) {
    let originalMethod = (instance as any)[name] || prototype[name];

    if (typeof originalMethod === "function") {
      const boundMethod = originalMethod.bind(instance);
      const wrappedMethod = HandleError(boundMethod);
      if ((instance as any)[name]) {
        (instance as any)[name] = wrappedMethod;
      } else {
        prototype[name] = wrappedMethod;
      }
    }
  }

  return instance;
}
