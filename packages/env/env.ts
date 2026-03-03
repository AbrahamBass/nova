export class Environment {
  constructor(private readonly nodeEnv: string) {}

  get name() {
    return this.nodeEnv;
  }

  isDevelopment() {
    return this.nodeEnv === "development";
  }

  isProduction() {
    return this.nodeEnv === "production";
  }

  isTest() {
    return this.nodeEnv === "test";
  }
}
