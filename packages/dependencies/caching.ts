import {
  BODY_KEY,
  FILE_KEY,
  FORM_KEY,
  MIDDLEWARE_KEY,
  PARAMS_KEY,
  REPLY_KEY,
  REQ_KEY,
} from "./decorators";
import type { StaticHandlerMeta } from "./type";
const handlerMetaCache = new WeakMap<Function, StaticHandlerMeta>();

export function resolveStaticMeta(
  instance: any,
  handlerName: string,
): StaticHandlerMeta {
  const handler = instance[handlerName];

  const cached = handlerMetaCache.get(handler);
  if (cached) return cached;

  const proto = Object.getPrototypeOf(instance);

  const meta: StaticHandlerMeta = {
    bodyMeta: Reflect.getMetadata(BODY_KEY, proto, handlerName),
    formMeta: Reflect.getMetadata(FORM_KEY, proto, handlerName),
    fileMeta: Reflect.getMetadata(FILE_KEY, proto, handlerName),
    paramMeta: Reflect.getMetadata(PARAMS_KEY, proto, handlerName) ?? [],
    middlewares: Reflect.getMetadata(MIDDLEWARE_KEY, proto, handlerName) ?? [],
    requiresAuth:
      Reflect.getMetadata("auth:required", proto, handlerName) ?? false,
    scopes: Reflect.getMetadata("auth:scopes", proto, handlerName) ?? [],
    reply: Reflect.getMetadata(REPLY_KEY, proto, handlerName),
    req: Reflect.getMetadata(REQ_KEY, proto, handlerName),
  };

  handlerMetaCache.set(handler, meta);
  return meta;
}
