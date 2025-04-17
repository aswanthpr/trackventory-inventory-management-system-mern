import {Request, Response, NextFunction} from "express";
import { HttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/httpStatus"; 
import { HttpResponse } from "../constants/responseMsg"; 
 
export const errorHandler =  ( 
    err:HttpError|Error,
    _req:Request,
    res:Response,
    _next:NextFunction

) =>{
   let statusCode = HttpStatus?.INTERNAL_SERVER_ERROR;
   let message :string = HttpResponse?.SERVER_ERROR;
if(err instanceof HttpError){
    statusCode = err?.statusCode;
    message = err?.message
}else{
    console.log(HttpResponse?.UNHANDLED_ERROR);
}
res.status(statusCode).json({error:message});
}
