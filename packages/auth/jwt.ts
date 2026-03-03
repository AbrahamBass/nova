import fastifyJwt, { type FastifyJWTOptions } from "@fastify/jwt";
import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export class Auth {
  static jwt(options: FastifyJWTOptions) {
    return async (app: FastifyInstance) => {
      if (options.cookie) {
        await app.register(cookie);
      }
      await app.register(fastifyJwt, options);
    };
  }
}
