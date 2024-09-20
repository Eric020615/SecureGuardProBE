// src/util/provideSingleton.ts
import { fluentProvide } from "inversify-binding-decorators";
import { interfaces } from "inversify";

// class that can only have on object
export const provideSingleton = function <T>(
  identifier: interfaces.ServiceIdentifier<T>
) {
  return fluentProvide(identifier).inSingletonScope().done();
};