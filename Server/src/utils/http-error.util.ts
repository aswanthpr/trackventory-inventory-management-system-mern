

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = new.target?.name;

    Object?.setPrototypeOf(this, new.target.prototype);

    if ((Error as any)?.captureStackTrace) {
      (Error as any)?.captureStackTrace(this, this.constructor);
    }
  }
}

export const createHttpError = (statusCode: number, message: string) => {
  return new HttpError(statusCode, message);
};
