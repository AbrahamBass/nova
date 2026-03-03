import type { FastifyInstance } from "fastify";

export interface OpenAPIOptions {
  title?: string;
  version?: string;
  description?: string;
  termsOfService?: string;
}

export interface AppOptions {
  logger: boolean;
  openapi?: OpenAPIOptions;
}

export const DEFAULT_OPENAPI: Required<OpenAPIOptions> = {
  title: "API",
  version: "1.0.0",
  description: "API documentation",
  termsOfService: "",
};

export type SecurityPlugin = (app: FastifyInstance) => Promise<void>;
