import type { ZodType } from "zod";

export interface RouteOptions {
  responseModel?: ZodType;
  statusCode?: number;
  tags?: string[];
  summary?: string;
  description?: string;
  includeInSchema?: boolean;
}
