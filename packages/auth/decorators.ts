export function RequiresAuth(): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // método
      Reflect.defineMetadata("auth:required", true, target, propertyKey);
    } else {
      // clase
      Reflect.defineMetadata("auth:required", true, target);
    }
  };
}

export function Scopes(...scopes: string[]): MethodDecorator {
  return (target, key) => {
    Reflect.defineMetadata("auth:scopes", scopes, target, key);
  };
}
