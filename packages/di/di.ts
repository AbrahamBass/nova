import { injectable, ServiceIdentifier, type Container } from "inversify";
import { AbstractConstructor, Constructor } from "./types";

export class Di {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  public instance<T>(token: ServiceIdentifier<T>, value: T) {
    this.container.bind(token).toConstantValue(value);
  }

  public factory<T>(token: ServiceIdentifier<T>, factory: () => T) {
    this.container.bind(token).toDynamicValue(factory).inSingletonScope();
  }

  public singleton<TAbstraction, TImplementation extends TAbstraction>(
    implementation: Constructor<TImplementation>,
    abstraction?: AbstractConstructor<TAbstraction>,
  ) {
    injectable()(implementation);

    if (abstraction) {
      this.container.bind(abstraction).to(implementation).inSingletonScope();
    } else {
      this.container.bind(implementation).toSelf().inSingletonScope();
    }
  }
  public transient<TAbstraction, TImplementation extends TAbstraction>(
    implementation: Constructor<TImplementation>,
    abstraction?: AbstractConstructor<TAbstraction>,
  ) {
    injectable()(implementation);

    if (abstraction) {
      this.container.bind(abstraction).to(implementation).inTransientScope();
    } else {
      this.container.bind(implementation).toSelf().inTransientScope();
    }
  }
  public request<TAbstraction, TImplementation extends TAbstraction>(
    implementation: Constructor<TImplementation>,
    abstraction?: AbstractConstructor<TAbstraction>,
  ) {
    injectable()(implementation);

    if (abstraction) {
      this.container.bind(abstraction).to(implementation).inRequestScope();
    } else {
      this.container.bind(implementation).toSelf().inRequestScope();
    }
  }
}
