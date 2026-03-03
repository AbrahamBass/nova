import { FastifyRequest } from "fastify";
import { InvalidParamTypeError } from "../exceptions/exceptions";
import type { ParamType } from "./type";

type CastFn = (value: unknown) => any;

const casters = new Map<ParamType, CastFn>([
  [String, (value) => String(value)],
  [
    Number,
    (value) => {
      const n = Number(value);
      if (Number.isNaN(n)) {
        throw new InvalidParamTypeError("number", value);
      }
      return n;
    },
  ],
  [
    Boolean,
    (value) => {
      if (value === true || value === "true") return true;
      if (value === false || value === "false") return false;
      throw new InvalidParamTypeError("boolean", value);
    },
  ],
  [
    Date,
    (value) => {
      const d = new Date(String(value));
      if (Number.isNaN(d.getTime())) {
        throw new InvalidParamTypeError("date", value);
      }
      return d;
    },
  ],
]);

export function castValue(value: unknown, type: ParamType) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const caster = casters.get(type);

  if (!caster) {
    throw new InvalidParamTypeError("param type");
  }

  return caster(value);
}

export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return false;
}

export function getContentType(req: FastifyRequest) {
  return req.headers["content-type"]?.split(";")[0];
}
