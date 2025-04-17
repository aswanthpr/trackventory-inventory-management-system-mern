import { HttpStatus } from "../constants/httpStatus";
import { HttpResponse } from "../constants/responseMsg";
import customer from "../model/CustomerModel";
import Sales from "./../model/salesModel";
import { createHttpError } from "./../utils/http-error.util";
import {Request,Response, NextFunction } from "express";


export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {name, address, mobile} = req.body;
    if (!name || !address || !mobile) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.INVALID_CREDENTIALS,
      );
    }

    const isCustomerExist = await customer.findOne({$or:[{name},{mobile}]});

    if (isCustomerExist) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.USER_FIELD_EXIST
      );
    } 

    const addCustomer = new customer(req.body);
    const user = await addCustomer.save();


    res
      .status(HttpStatus?.CREATED)
      .json({message: HttpResponse?.PRODUCT_ADD, success: true, customer:user});
  } catch (error: unknown) {
    next(error);
  }
};


export const fetchCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
     
        const {search}  = req.query;
        console.log(search)
        const searchFilter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } }, 
              { address: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      
      const customerData = await customer.find(searchFilter).sort({ createdAt: -1 }).select("-updatedAt  -__v");

  
      res
        .status(HttpStatus?.OK)
        .json({
          message: HttpResponse?.RESOURCE_FOUND,
          success: true,
          customer: customerData ? customerData : [],
        });
    } catch (error: unknown) {
      next(error);
    }
  };
  


export const editCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {name, address, mobile,_id} = req.body;
      if (!name || !address || !mobile||!_id ) {
        console.log(name, address, mobile,_id);
  
        throw createHttpError(
          HttpStatus?.BAD_REQUEST,
          HttpResponse?.INVALID_CREDENTIALS,
        );
      }
      delete req.body._id;
      const editCustomer = await customer.findByIdAndUpdate(
        {_id},
        {$set: req.body},
      );
  
      res
        .status(HttpStatus?.OK)
        .json({
          message: HttpResponse?.PRODUCT_EDIT,
          success: true,
          customer: editCustomer,
        });
    } catch (error: unknown) {
      next(error);
    }
  };
  
export const deleteCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {_id} = req.query;
      console.log(_id,'thsi is id')
      if (!_id) {
        throw createHttpError(
          HttpStatus?.BAD_REQUEST,
          HttpResponse?.INVALID_CREDENTIALS,
        );
      }
      const deleteCustomer = await customer.findByIdAndDelete(_id);

      res
        .status(HttpStatus?.OK)
        .json({message: HttpResponse?.DELETE_SUCCESS, success: true});
    } catch (error: unknown) {
      next(error);
    }
  };
  export const customCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {customer} = req.body;
      console.log(String(customer),'thsi is id')
      if (!customer) {
        throw createHttpError(
          HttpStatus?.BAD_REQUEST,
          HttpResponse?.INVALID_CREDENTIALS,
        );
      }
      const customers = await Sales.find({customer});

      console.log(customer)

      res
        .status(HttpStatus?.OK)
        .json({customers,message: HttpResponse?.RESOURCE_FOUND, success: true});
    } catch (error: unknown) {
      next(error);
    }
  };
