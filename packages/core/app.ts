import { buildPreHandlers, wrapHandler } from "../dependencies/utils";
import { Server } from "../http/server";
import { Container } from "inversify";

import type { Class } from "./types";
import { extractControllerData } from "../routing/decorators";
import { joinPath, normalizePath } from "../routing/helpers";
import {
  DEFAULT_OPENAPI,
  type AppOptions,
  type OpenAPIOptions,
  type SecurityPlugin,
} from "./options";
import { Di } from "../di/di";
import { resolveStaticMeta } from "../dependencies/caching";
import { generateSchema } from "../openAPI/doc";
import type { middlewareFn } from "../middlewares/type";
import { authGuard, scopesGuard } from "../middlewares/auth";
import { Environment } from "../env/env";
import { Module } from "./module";

export class App {
  private server: Server;
  private controllers: Class[];
  private container: Container;
  private di: Di;
  private openapiConfig: Required<OpenAPIOptions>;
  private globalPreHandler: middlewareFn[];

  constructor(options?: AppOptions) {
    this.server = new Server(options?.logger ?? true);

    this.controllers = [];
    this.container = new Container();
    this.di = new Di(this.container);
    this.globalPreHandler = [];

    this.openapiConfig = {
      ...DEFAULT_OPENAPI,
      ...options?.openapi,
    };
  }

  private async setupCore() {
    const app = this.server.app;

    app.decorate("env", new Environment(process.env.NODE_ENV ?? "development"));

    await app.register(import("@fastify/formbody"));
    await app.register(import("@fastify/multipart"), {
      attachFieldsToBody: true,
    });
  }

  get env(): Environment {
    return this.server.app.env;
  }

  public use(fn: middlewareFn) {
    this.globalPreHandler.push(fn);
  }

  public include(module: Module) {
    module.applyServices(this.register());

    const controllers = module.getControllers();
    controllers.forEach((c) => this.includeController(c));
  }

  async security(plugins: SecurityPlugin | SecurityPlugin[]) {
    const arr = Array.isArray(plugins) ? plugins : [plugins];
    for (const plugin of arr) {
      await plugin(this.server.app);
    }
  }

  public includeController<T>(controller: Class<T>) {
    this.container.bind(controller).toSelf();
    this.controllers.push(controller);
  }

  public register() {
    return this.di;
  }

  public async openAPI() {
    await this.server.app.register(import("@fastify/swagger"), {
      openapi: {
        info: {
          title: this.openapiConfig.title,
          version: this.openapiConfig.version,
          description: this.openapiConfig.description,
          termsOfService: this.openapiConfig.termsOfService,
        },
      },
    });
  }

  public async enableDocs() {
    await this.server.app.register(import("@fastify/swagger-ui"), {
      routePrefix: "/docs",
    });
  }

  private registerController() {
    this.controllers.forEach((c) => {
      const { prefix, controllerAuth, controllerMiddlewares, routes } =
        extractControllerData(c);
      const instance = this.container.get(c);
      routes.forEach((r) => {
        const staticMeta = resolveStaticMeta(instance, r.handlerName);
        const handler = instance[r.handlerName].bind(instance);
        const schema = generateSchema(staticMeta, r.options);
        const middlewares = [
          ...(this.globalPreHandler ?? []),
          ...controllerMiddlewares,
          ...(staticMeta.middlewares ?? []),
        ];

        const requiresAuth = staticMeta.requiresAuth ?? controllerAuth ?? false;
        if (requiresAuth) {
          middlewares.splice(0, 0, authGuard(staticMeta));
        }
        if (staticMeta.scopes?.length)
          middlewares.splice(0, 1, scopesGuard(staticMeta));
        this.server.app.route({
          method: r.httpMethod,
          url: normalizePath(joinPath(prefix, r.path)),
          preHandler: buildPreHandlers(middlewares),
          schema: schema,
          handler: wrapHandler(staticMeta, handler, r.options),
        });
      });
    });
  }

  private async bootstrap() {
    await this.setupCore();

    if (this.controllers.length > 0) {
      this.registerController();
    }

    await this.server.app.ready();
  }

  public async listen(port: number) {
    await this.bootstrap();
    await this.server.listen(port);
  }
}
