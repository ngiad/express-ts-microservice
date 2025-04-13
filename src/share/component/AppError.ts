// import { ZodError } from "zod";
// import { ResponseError } from "../response/response.error";

// export class AppError extends ResponseError {
//   private rootCause?: ResponseError;
//   private constructor(
//     public readonly status: number = 500,
//     public readonly message: string = "Internal server error",
//     public readonly data?: any,
//     public detail?: any,
//     public logMessageErr?: any
//   ) {
//     super(status, message, data);
//   }

//   static from(err: ResponseError) {
//     return new AppError(err.status, err.message, err.data ?? null);
//   }

//   getRootCause(): ResponseError | null {
//     if (this.rootCause)
//       return this.rootCause instanceof AppError
//         ? this.rootCause.getRootCause()
//         : this.rootCause;
//     return null;
//   }

//   // wrapper (Design pattern)
//   wrap(rootCause: ResponseError | ZodError): AppError {
//     const appError = AppError.from(this);
//     appError.rootCause = rootCause;
//     return appError;
//   }

//   // SETTER CHAIN (Design pattern hỗ trợ code không thuộc Design pattern OOP)
//   withDetai(key: string, value: any): AppError {
//     this.detail[key] = value;
//     return this;
//   }

//   // SETTER CHAIN (Design pattern hỗ trợ code không thuộc Design pattern OOP)
//   withLog(logMessage: string): AppError {
//     this.logMessageErr = logMessage;
//     return this;
//   }

//   toJSON(isProduction: boolean = true) {
//     const rootCause = this.getRootCause();
//     return isProduction
//       ? {
//           message: this.message,
//           status: this.status,
//           detail: this.detail,
//         }
//       : {
//           message: this.message,
//           status: this.status,
//           detail: this.detail,
//           rootCause: rootCause ? rootCause.message : this.message,
//           logMessage: this.logMessageErr,
//           rootStack: rootCause ? rootCause.stack : this.stack,
//         };
//   }

//   getStatusCode(): number {
//     return this.status;
//   }
// }



import { ZodError } from "zod";
import { ResponseError } from "../response/response.error";

export class AppError extends ResponseError {
  private rootCause?: ResponseError | ZodError;
  private constructor(
    public readonly status: number = 500,
    public readonly message: string = "Internal server error",
    public readonly data?: any,
    public detail: Record<string, any> = {},
    public logMessageErr?: string
  ) {
    super(status, message, data);
  }

  static from(err: ResponseError | ZodError): AppError {
    if (err instanceof AppError) return err;

    if (err instanceof ResponseError) {
      return new AppError(err.status, err.message, err.data);
    }

    if (err instanceof ZodError) {
      const flattened = err.flatten();
      const detail = flattened.fieldErrors || {};
      const appError = new AppError(422, "Validation error", null, detail);
      appError.rootCause = err;
      return appError;
    }
    return new AppError();
  }

  getRootCause(): ResponseError | ZodError | null {
    if (this.rootCause instanceof AppError) {
      return this.rootCause.getRootCause();
    }
    return this.rootCause ?? null;
  }

  wrap(rootCause: ResponseError | ZodError): AppError {
    const appError = AppError.from(this);
    appError.rootCause = rootCause;
    return appError;
  }

  withDetail(key: string, value: any): AppError {
    this.detail[key] = value;
    return this;
  }

  withLog(logMessage: string): AppError {
    this.logMessageErr = logMessage;
    return this;
  }

  toJSON(isProduction: boolean = true) {
    const rootCauseOutput =
      this.getRootCause() && this.getRootCause() instanceof ResponseError
        ? (this.getRootCause() as ResponseError).message
        : "";
    const output: Record<string, any> = {
      message: this.message,
      statusCode: this.status,
      detail: this.detail,
      rootCause: rootCauseOutput,
    };

    if (!isProduction) {
      output.logMessage = this.logMessageErr;
      output.rootStack = this.stack;
    }

    return output;
  }

  getStatusCode(): number {
    return this.status;
  }
}





