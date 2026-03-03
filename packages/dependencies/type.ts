import type { MultipartFile } from "@fastify/multipart";
import z from "zod";
import type { middlewareFn } from "../middlewares/type";
import type { Request } from "../request/base";

export type ParamType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | DateConstructor;

export type ParamSource = "path" | "query" | "user";

export type FileRequest = Request & {
  file: () => Promise<MultipartFile>;
};

export type ParamMeta = {
  index: number;
  source: ParamSource;
  name?: string;
  type?: ParamType;
  optional: boolean;
};

export type BodyMeta = {
  index: number;
  schema: z.ZodSchema;
};

export type FormMeta = {
  index: number;
  name: string;
  optional: boolean;
};

export type FileMeta = {
  index: number;
  name: string;
  optional: boolean;
};

export type ReplyMeta = {
  index: number;
};

export type ReqMeta = {
  index: number;
};

export type StaticHandlerMeta = {
  bodyMeta?: BodyMeta;
  formMeta?: FormMeta[];
  fileMeta?: FileMeta[];
  paramMeta?: ParamMeta[];
  reply?: ReplyMeta;
  req?: ReqMeta;
  middlewares?: middlewareFn[];
  requiresAuth?: boolean;
  scopes?: string[];
};
