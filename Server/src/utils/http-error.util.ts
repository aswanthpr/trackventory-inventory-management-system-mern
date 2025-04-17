
export class HttpError extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
  
     
      Object.setPrototypeOf(this, new.target.prototype);
  
      
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  

export const createHttpError = (statusCode: number, message: string) => {
    return new HttpError(statusCode, message);
}