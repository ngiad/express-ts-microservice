import { Response } from "express";

export class ResponseSuccess<T> {
  constructor(
    public readonly data: T | null = null,
    public readonly status: number = 200,
    public readonly message: string = "Request successful"
  ) {}

  send(res: Response) {
    res.status(this.status).json({
      success: true,
      message: this.message,
      data: this.data,
    });
  }
}

export class ResponseSuccessList<T> extends ResponseSuccess<T[]> {
  constructor(data: T[] | null = null) {
    super(data, 200, "List retrieved successfully");
  }
}

export class ResponseSuccessDetail<T> extends ResponseSuccess<T> {
  constructor(data: T | null = null) {
    super(data, 200, "Detail retrieved successfully");
  }
}

export class ResponseSuccessDelete<T> extends ResponseSuccess<T> {
  constructor(data: T | null = null) {
    super(data, 200, "Deleted successfully");
  }
}

export class ResponseSuccessUpdate<T> extends ResponseSuccess<T> {
  constructor(data: T | null = null) {
    super(data, 200, "Updated successfully");
  }
}

export class ResponseSuccessCreate<T> extends ResponseSuccess<T> {
  constructor(data: T | null = null) {
    super(data, 201, "Created successfully");
  }
}

export class ResponseSuccessOk<T> extends ResponseSuccess<T> {
  constructor(data: T | null = null) {
    super(data, 200, "Operation successful");
  }
}
