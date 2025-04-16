import {env} from '@src/config/env.config';
import {HttpStatus} from '@src/constants/httpStatus';
import {HttpResponse} from '@src/constants/responseMsg';
import {createHttpError} from '@src/utils/http-error.util';
import express, {NextFunction, Request, Response, urlencoded} from 'express';

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.USER_NOT_FOUND,
      );
    }
    // const decode = atob(encode)
    // console.log(encode,decode)
    if (email !== env?.EMAIL || password !== env?.PASSWORD) {
        throw createHttpError(
            HttpStatus?.BAD_REQUEST,
            HttpResponse?.INVALID_CREDENTIALS,
        );
    }
    const encode =  btoa(email)
    res 
      .cookie('userToken', encode, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .status(HttpStatus?.OK)
      .json({encode,message: 'login success', success: true});

    console.log(email, password);
  } catch (error: unknown) {
    next(error);
  }
};


