export { Auth } from "./auth/jwt";
export { RequiresAuth, Scopes } from "./auth/decorators";
export { inject, optional } from "inversify";

export { MultipartFile } from "@fastify/multipart";

export { NovaFactory } from "./core/nova";
export {
  Body,
  CurrentUser,
  File,
  Middleware,
  Path,
  Query,
  Reply,
  Request,
} from "./dependencies/decorators";

export { Module } from "./core/module";

export { StatusHTTP } from "./status/statusHTTP";

export {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  PaymentRequiredException,
  ForbiddenException,
  NotFoundException,
  MethodNotAllowedException,
  NotAcceptableException,
  ConflictException,
  GoneException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  TooManyRequestsException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  RequestValidationError,
  ResponseValidationError,
  InvalidParamTypeError,
} from "./exceptions/exceptions";

export { Security } from "./middlewares/security";

export type { Request as NovaRequest, Instance } from "./request/base";

export type { Reply as NovaResponse } from "./response/base";

export { Controller, Get, Post, Put, Delet, Patch } from "./routing/decorators";

export { Uuid } from "./uuid/base";
