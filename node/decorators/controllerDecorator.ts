import "reflect-metadata";
import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import { routerHander } from "./routeHandlersController";
import { routers } from "./Routers";
import { Request, Response, Router } from "express";

export function controller(rootPath: string) {
  return function (target: any) {
    const router = Router({ mergeParams: true });
    routers[target.name] = router;

    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      if (key === "constructor") {
        continue;
      }
      const method =
        Reflect.getMetadata(metadataKeys.method, target.prototype, key) ||
        "get";
      const path =
        Reflect.getMetadata(metadataKeys.path, target.prototype, key) || "";

      if (method) {
        let funcStack: any[] = [
          routerHander(target.prototype[key], target.prototype),
        ];

        router.route(`${rootPath}${path}`)[method](...funcStack);
      }
    }
  };
}
