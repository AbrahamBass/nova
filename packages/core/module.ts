import { Di } from "../di/di";
import { AbstractConstructor, Constructor } from "../di/types";

export class Module {
  private controllers: Constructor<any>[] = [];
  private services: Array<{
    impl: Constructor<any>;
    abstraction?: AbstractConstructor<any>;
    scope: string;
  }> = [];
  private subModules: Module[] = [];

  registerController(controller: Constructor<any>) {
    this.controllers.push(controller);
    return this;
  }

  registerSingleton(
    impl: Constructor<any>,
    abstraction?: AbstractConstructor<any>,
  ) {
    this.services.push({ impl, abstraction, scope: "singleton" });
    return this;
  }

  include(module: Module) {
    this.subModules.push(module);
    return this;
  }

  // Devuelve todos los controllers recursivamente
  getControllers(): Constructor<any>[] {
    const subControllers = this.subModules.flatMap((m) => m.getControllers());
    return [...this.controllers, ...subControllers];
  }

  // Aplica todos los servicios en el DI central
  applyServices(di: Di) {
    this.services.forEach((s) => {
      switch (s.scope) {
        case "singleton":
          di.singleton(s.impl, s.abstraction);
          break;
        case "transient":
          di.transient(s.impl, s.abstraction);
          break;
      }
    });
    this.subModules.forEach((m) => m.applyServices(di));
  }
}
