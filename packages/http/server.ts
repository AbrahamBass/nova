import Fastify, { type FastifyInstance } from "fastify";
import type { Environment } from "../env/env";

declare module "fastify" {
  interface FastifyInstance {
    env: Environment;
  }
}

export class Server {
  public readonly app: FastifyInstance;

  constructor(logger: boolean) {
    this.app = Fastify({
      logger: logger,
    });
  }

  public async listen(port: number) {
    await this.app.listen({ port });
  }
}
