import type { ValidationErrorItem } from "./abstractions";

export class HttpException extends Error {
  public statusCode: number;
  public detail?: any;

  constructor(statusCode: number, message: string, detail?: any) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(detail?: any) {
    super(400, "Bad Request", detail);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(detail?: any) {
    super(401, "Unauthorized", detail);
  }
}

export class PaymentRequiredException extends HttpException {
  constructor(detail?: any) {
    super(402, "Payment Required", detail);
  }
}

export class ForbiddenException extends HttpException {
  constructor(detail?: any) {
    super(403, "Forbidden", detail);
  }
}

export class NotFoundException extends HttpException {
  constructor(detail?: any) {
    super(404, "Not Found", detail);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(detail?: any) {
    super(405, "Method Not Allowed", detail);
  }
}

export class NotAcceptableException extends HttpException {
  constructor(detail?: any) {
    super(406, "Not Acceptable", detail);
  }
}

export class ConflictException extends HttpException {
  constructor(detail?: any) {
    super(409, "Conflict", detail);
  }
}

export class GoneException extends HttpException {
  constructor(detail?: any) {
    super(410, "Gone", detail);
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(detail?: any) {
    super(415, "Unsupported Media Type", detail);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(detail?: any) {
    super(422, "Unprocessable Entity", detail);
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(detail?: any) {
    super(429, "Too Many Requests", detail);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(detail?: any) {
    super(500, "Internal Server Error", detail);
  }
}

export class NotImplementedException extends HttpException {
  constructor(detail?: any) {
    super(501, "Not Implemented", detail);
  }
}

export class BadGatewayException extends HttpException {
  constructor(detail?: any) {
    super(502, "Bad Gateway", detail);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(detail?: any) {
    super(503, "Service Unavailable", detail);
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(detail?: any) {
    super(504, "Gateway Timeout", detail);
  }
}

export class RequestValidationError extends HttpException {
  constructor(detail: ValidationErrorItem[]) {
    super(404, "Request validation error", detail);
  }
}

export class ResponseValidationError extends HttpException {
  constructor(error: any) {
    super(500, "Response validation failed");
    this.detail = error.errors;
  }
}

export class InvalidParamTypeError extends Error {
  constructor(
    public readonly expected: string,
    public readonly received?: unknown,
  ) {
    super(`Expected ${expected}, received ${received}`);
  }
}
