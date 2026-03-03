export interface ValidationErrorItem {
  loc: [string, string?];
  msg: string;
  type: "missing" | "invalid" | "invalid_content_type";
}
