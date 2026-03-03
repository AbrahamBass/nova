import { App } from "./app";
import { AppOptions } from "./options";

export class NovaFactory {
  static async create(options?: AppOptions): Promise<App> {
    const app = new App(options);
    return app;
  }
}
