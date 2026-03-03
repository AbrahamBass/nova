import "reflect-metadata";
import { injectable } from "inversify";
import { MIDDLEWARE_KEY } from "../dependencies/decorators";
import type { middlewareFn } from "../middlewares/type";
import type { RouteOptions } from "./options";

// types.ts (opcional)
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RouteDefinition {
  handlerName: string; // nombre del método en la clase
  httpMethod: HttpMethod;
  path: string;
  options?: RouteOptions;
}

// metadata keys (símbolos para evitar colisiones)
const PREFIX_KEY = Symbol("prefix");
const ROUTES_KEY = Symbol("routes");

/**
 * Decorador de clase: @controller(prefix)
 */
export function Controller(prefix: string) {
  return function (constructor: Function) {
    injectable()(constructor);

    Reflect.defineProperty(constructor, PREFIX_KEY, {
      value: prefix,
      writable: false,
      configurable: false,
    });

    if (!(constructor as any)[ROUTES_KEY]) {
      (constructor as any)[ROUTES_KEY] = [] as RouteDefinition[];
    }
  };
}

/**
 * Helper para crear decoradores de método (GET/POST)
 */
function createMethodDecorator(httpMethod: HttpMethod) {
  return function (path: string = "", options?: RouteOptions) {
    return function (target: any, propertyKey: any) {
      const ctor = target.constructor;

      if (!ctor[ROUTES_KEY]) {
        ctor[ROUTES_KEY] = [] as RouteDefinition[];
      }

      ctor[ROUTES_KEY].push({
        handlerName: propertyKey,
        httpMethod,
        path,
        options,
      });
    };
  };
}

/** Decoradores de uso público */
export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Patch = createMethodDecorator("PATCH");
export const Delet = createMethodDecorator("DELETE");

/**
 * extractControllerData(controllerOrInstance)
 * Devuelve { prefix, routes: RouteDefinition[] }
 * Acepta tanto la clase como una instancia.
 */
export function extractControllerData(controllerOrInstance: any) {
  const ctor =
    typeof controllerOrInstance === "function"
      ? controllerOrInstance
      : controllerOrInstance.constructor;

  const prefix: string = (ctor as any)[PREFIX_KEY] ?? "";
  const routes: RouteDefinition[] = (ctor as any)[ROUTES_KEY] ?? [];

  const controllerAuth: boolean =
    Reflect.getMetadata("auth:required", ctor) ?? false;

  const controllerMiddlewares: middlewareFn[] =
    Reflect.getMetadata(MIDDLEWARE_KEY, ctor) ?? [];

  return {
    prefix,
    controllerAuth,
    controllerMiddlewares,
    routes: routes.map((r) => ({ ...r })),
  };
}
