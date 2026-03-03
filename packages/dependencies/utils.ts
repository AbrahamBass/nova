import type { StaticHandlerMeta } from "./type";
import { castValue, getContentType, isEmptyValue } from "./helpers";
import {
  HttpException,
  InvalidParamTypeError,
  RequestValidationError,
  ResponseValidationError,
} from "../exceptions/exceptions";
import type { ValidationErrorItem } from "../exceptions/abstractions";
import type { RouteOptions } from "../routing/options";
import type { middlewareFn } from "../middlewares/type";
import type { Request } from "../request/base";
import type { Reply } from "../response/base";
import { FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";

export async function resolveRequestArgs(
  meta: StaticHandlerMeta,
  req: FastifyRequest,
  reply: Reply,
): Promise<{ args: any[]; errors: ValidationErrorItem[] }> {
  const args: any[] = [];
  const errors: ValidationErrorItem[] = [];

  const contentType = getContentType(req);

  const isJson = contentType === "application/json";
  const isForm = contentType === "application/x-www-form-urlencoded";

  if (meta.bodyMeta) {
    if (!isJson && !isForm) {
      errors.push({
        loc: ["body"],
        msg: "Content-Type must be application/json or application/x-www-form-urlencoded",
        type: "invalid_content_type",
      });
    } else {
      const body = req.body as Record<string, unknown>;

      const parsed = meta.bodyMeta.schema.safeParse(body);

      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.push({
            loc: ["body", issue.path.join(".") || "undefined"],
            msg: issue.message,
            type: "invalid",
          });
        }
      } else {
        args[meta.bodyMeta.index] = parsed.data;
      }
    }
  }

  if (meta.fileMeta) {
    if (!req.isMultipart()) {
      errors.push({
        loc: ["form"],
        msg: "Content-Type must be multipart/form-data",
        type: "invalid_content_type",
      });
    } else {
      const files = new Map<string, MultipartFile>();

      for await (const part of req.parts()) {
        if (part.type === "file") {
          files.set(part.fieldname, part);
        }
      }

      for (const f of meta.fileMeta) {
        const file = files.get(f.name);

        if (!file && !f.optional) {
          errors.push({
            loc: ["form", f.name],
            msg: "file required",
            type: "missing",
          });
        } else {
          args[f.index] = file;
        }
      }
    }
  }

  if (meta.req) {
    args[meta.req.index] = req;
  }

  if (meta.reply) {
    args[meta.reply.index] = reply;
  }

  const params = req.params as Record<string, unknown>;
  const query = req.query as Record<string, unknown>;

  for (const p of meta.paramMeta ?? []) {
    let value: unknown;

    switch (p.source) {
      case "path":
        value = params?.[p.name!];
        break;

      case "query":
        value = query?.[p.name!];
        break;

      case "user":
        value = req.user;
        break;

      default:
        value = undefined;
    }

    if (isEmptyValue(value)) {
      if (!p.optional) {
        errors.push({
          loc: [p.source.toString(), p.name ?? "undefined"],
          msg: "field required",
          type: "missing",
        });
      }
    } else {
      if (p.source === "user") {
        args[p.index] = value;
      } else {
        try {
          args[p.index] = castValue(value, p.type!);
        } catch (err) {
          if (err instanceof InvalidParamTypeError) {
            errors.push({
              loc: [p.source, p.name ?? "unknown"],
              msg: err.message,
              type: "invalid",
            });
            continue;
          }
        }
      }
    }
  }

  return { args, errors };
}

export function buildPreHandlers(middlewares: middlewareFn[] = []) {
  return middlewares.map((fn) => async (req: Request, reply: Reply) => {
    await fn(req, reply);
    if (reply.sent) return;
  });
}

export function wrapHandler(
  meta: StaticHandlerMeta,
  handler: Function,
  options?: RouteOptions,
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { args, errors } = await resolveRequestArgs(meta, req, reply);
      if (errors.length) throw new RequestValidationError(errors);

      const result = await handler(...args);

      let dataToSend = result;
      if (options?.responseModel) {
        const parsed = options.responseModel.safeParse(result);
        if (!parsed.success) {
          throw new ResponseValidationError(parsed.error);
        }
        dataToSend = parsed.data;
      }

      const statusCode = options?.statusCode ?? 200;

      return reply.status(statusCode).send(dataToSend);
    } catch (err) {
      if (err instanceof HttpException) {
        return reply
          .status(err.statusCode)
          .send({ detail: err.detail ?? err.message });
      }

      console.error("Unhandled error:", err);
      return reply.status(500).send({ detail: "Internal server error" });
    }
  };
}
