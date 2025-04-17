import {HttpStatus} from '@src/constants/httpStatus';
import {HttpResponse} from '@src/constants/responseMsg';
import Inventory from '@src/model/inventoryModel';
import {createHttpError} from '@src/utils/http-error.util';
import  {NextFunction, Request, Response} from 'express';

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {name, description, price, quantity} = req.body;
    console.log(name,description,price,quantity,'hai hai ahi ')
    if (!name || !description || !price || !quantity) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.INVALID_CREDENTIALS,
      );
    }

    const isProductExist = await Inventory.findOne({name});

    if (isProductExist) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.INVENTORY_EXIST,
      );
    }

    const addProduct = new Inventory(req.body);
    const product = await addProduct.save();
    console.log(product, 'saved');

    res
      .status(HttpStatus?.CREATED)
      .json({message: HttpResponse?.PRODUCT_ADD, success: true, product});
  } catch (error: unknown) {
    next(error);
  }
};

export const fetchInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {search}  = req.query;
    const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } }, 
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};
    const product = await Inventory.find(searchFilter) .select("-updatedAt -createdAt  -__v");;

    res
      .status(HttpStatus?.OK)
      .json({
        message: HttpResponse?.RESOURCE_FOUND,
        success: true,
        product: product ? product : [],
      });
  } catch (error: unknown) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {name, description, price, quantity, _id} = req.body;
    if (!name || !description || !price || !quantity || !_id) {
      console.log(name, description, price, quantity, _id);

      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.INVALID_CREDENTIALS,
      );
    }
    delete req.body._id;
    const editProduct = await Inventory.findByIdAndUpdate(
      {_id},
      {$set: req.body},
    );

    res
      .status(HttpStatus?.OK)
      .json({
        message: HttpResponse?.PRODUCT_EDIT,
        success: true,
        product: editProduct,
      });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {_id} = req.query;
    if (!_id) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.INVALID_CREDENTIALS,
      );
    }
    const editProduct = await Inventory.findByIdAndDelete({_id});
console.log(editProduct)
    res
      .status(HttpStatus?.OK)
      .json({message: HttpResponse?.DELETE_SUCCESS, success: true});
  } catch (error: unknown) {
    next(error);
  }
};
