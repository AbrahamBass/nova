import { toJSONSchema } from "zod";
import type { RouteOptions } from "../routing/options";
import type { StaticHandlerMeta } from "../dependencies/type";
import { mapTsTypeToJsonSchema } from "./helper";

type JSONSchemaObject = {
  type: "object";
  properties: Record<string, any>;
  required?: string[];
};

export function generateSchema(
  staticMeta: StaticHandlerMeta,
  options?: RouteOptions,
) {
  const schema: any = {};

  if (!options || !options.includeInSchema) return schema;

  if (options.summary) schema.summary = options.summary;
  if (options.description) schema.description = options.description;
  if (options.responseModel) {
    schema.response = {
      [options.statusCode ?? 200]: toJSONSchema(options.responseModel),
    };
  }

  if (staticMeta?.requiresAuth) {
    schema.security = [{ BearerAuth: [] }, { CookieAuth: [] }];
  }

  if (staticMeta.bodyMeta) {
    schema.body = toJSONSchema(staticMeta.bodyMeta.schema);
  }

  const paramsSchema: JSONSchemaObject = {
    type: "object",
    properties: {},
  };

  const querySchema: JSONSchemaObject = {
    type: "object",
    properties: {},
  };

  for (const p of staticMeta.paramMeta ?? []) {
    const target = p.source === "path" ? paramsSchema : querySchema;

    target.properties[p.name!] = mapTsTypeToJsonSchema(p.type);
    target.required ??= [];
    if (!p.optional) target.required.push(p.name!);
  }

  if (Object.keys(paramsSchema.properties).length) {
    schema.params = paramsSchema;
  }

  if (Object.keys(querySchema.properties).length) {
    schema.querystring = querySchema;
  }

  return schema;
}
