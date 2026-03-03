import "reflect-metadata";
import { z } from "zod";
import type { ParamMeta, ParamType } from "./type";
import type { middlewareFn } from "../middlewares/type";

export const PARAMS_KEY = Symbol("params");
export const BODY_KEY = Symbol("body");
export const FORM_KEY = Symbol("form");
export const FILE_KEY = Symbol("file");
export const MIDDLEWARE_KEY = Symbol("middleware");
export const REPLY_KEY = Symbol("reply");
export const REQ_KEY = Symbol("req");

export function Path(name: string): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    index: number,
  ) => {
    const existing: ParamMeta[] =
      Reflect.getMetadata(PARAMS_KEY, target, propertyKey!) ?? [];

    const types = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey!,
    );

    existing.push({
      index,
      source: "path",
      name,
      type: types[index] as ParamType,
      optional: false,
    });

    Reflect.defineMetadata(PARAMS_KEY, existing, target, propertyKey!);
  };
}

export function Query(
  name: string,
  opts?: { optional?: boolean },
): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing: ParamMeta[] =
      Reflect.getMetadata(PARAMS_KEY, target, propertyKey!) ?? [];

    const types =
      Reflect.getMetadata("design:paramtypes", target, propertyKey!) ?? [];

    existing.push({
      index,
      source: "query",
      name,
      type: types[index] as ParamType,
      optional: opts?.optional ?? false,
    });
    Reflect.defineMetadata(PARAMS_KEY, existing, target, propertyKey!);
  };
}

export function Body(schema: z.ZodSchema): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing = Reflect.getMetadata(BODY_KEY, target, propertyKey!);
    if (existing) {
      throw new Error("Only one @Body decorator is allowed per method");
    }
    Reflect.defineMetadata(BODY_KEY, { index, schema }, target, propertyKey!);
  };
}

export function File(
  name: string,
  opts?: { optional?: boolean },
): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing = Reflect.getMetadata(FILE_KEY, target, propertyKey!) ?? [];

    existing.push({ index, name, optional: opts?.optional ?? false });

    Reflect.defineMetadata(FILE_KEY, existing, target, propertyKey!);
  };
}

export function Middleware(
  ...fns: middlewareFn[]
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // Método
      const existing: middlewareFn[] =
        Reflect.getMetadata(MIDDLEWARE_KEY, target, propertyKey) ?? [];

      Reflect.defineMetadata(
        MIDDLEWARE_KEY,
        [...existing, ...fns],
        target,
        propertyKey,
      );
    } else {
      // Controller
      const existing: middlewareFn[] =
        Reflect.getMetadata(MIDDLEWARE_KEY, target) ?? [];

      Reflect.defineMetadata(MIDDLEWARE_KEY, [...existing, ...fns], target);
    }
  };
}

export function CurrentUser(): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing: ParamMeta[] =
      Reflect.getMetadata(PARAMS_KEY, target, propertyKey!) ?? [];
    if (existing.length) {
      throw new Error("Only one @CurrentUser decorator is allowed per method");
    }

    existing.push({
      index,
      source: "user",
      optional: false,
    });

    Reflect.defineMetadata(PARAMS_KEY, existing, target, propertyKey!);
  };
}

export function Request(): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing = Reflect.getMetadata(REQ_KEY, target, propertyKey!);
    if (existing) {
      throw new Error("Only one @Req decorator is allowed per method");
    }

    Reflect.defineMetadata(REQ_KEY, { index }, target, propertyKey!);
  };
}

export function Reply(): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existing = Reflect.getMetadata(REPLY_KEY, target, propertyKey!);
    if (existing) {
      throw new Error("Only one @Reply decorator is allowed per method");
    }

    Reflect.defineMetadata(REPLY_KEY, { index }, target, propertyKey!);
  };
}
