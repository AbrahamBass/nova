export function mapTsTypeToJsonSchema(type: any) {
  switch (type) {
    case String:
      return { type: "string" };
    case Number:
      return { type: "number" };
    case Boolean:
      return { type: "boolean" };
    default:
      return { type: "string" };
  }
}
