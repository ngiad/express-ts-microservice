import { Response } from "express";
export class ResponseError extends Error {
  constructor(
    public readonly status: number = 500,
    public readonly message: string = "Internal server error",
    public readonly data: any = null,
  ) {
    super(message);
  }
}

// 400 - Bad Request
export class ResponseErrorBadRequest extends ResponseError {
  constructor(message: string = "Bad request", data: any = null) {
    super(400, message, data);
  }
}

// 401 - Unauthorized
export class ResponseErrorUnauthorized extends ResponseError {
  constructor(message: string = "Unauthorized", data: any = null) {
    super(401, message, data);
  }
}

// 403 - Forbidden
export class ResponseErrorForbidden extends ResponseError {
  constructor(message: string = "Forbidden", data: any = null) {
    super(403, message, data);
  }
}

// 404 - Not Found
export class ResponseErrorNotFound extends ResponseError {
  constructor(message: string = "Not found", data: any = null) {
    super(404, message, data);
  }
}

// 409 - Conflict
export class ResponseErrorConflict extends ResponseError {
  constructor(message: string = "Conflict", data: any = null) {
    super(409, message, data);
  }
}

// 422 - Unprocessable Entity
export class ResponseErrorUnprocessableEntity extends ResponseError {
  constructor(message: string = "Unprocessable entity", data: any = null) {
    super(422, message, data);
  }
}

// 500 - Internal Server Error (default)
export class ResponseErrorInternal extends ResponseError {
  constructor(message: string = "Internal server error", data: any = null) {
    super(500, message, data);
  }
}
