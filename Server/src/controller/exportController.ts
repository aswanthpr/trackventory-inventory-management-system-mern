
import { Request, Response, NextFunction } from "express";
import { nodeMailer } from "../config/nodemailer";
import { HttpStatus } from "../constants/httpStatus";
import { HttpResponse } from "../constants/responseMsg";


export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    try {
        
        const { email, data } = req.body;
      
        if (!email || !data) {
           res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: HttpResponse.INVALID_CREDENTIALS });
            return
        }
        await nodeMailer(email,data)
        res.status(HttpStatus?.OK).json({ message: "Email sent" });
    } catch (error:unknown) {
        next(error)
    }

};
