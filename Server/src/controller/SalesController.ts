import {HttpStatus} from '@src/constants/httpStatus';
import customer from '@src/model/CustomerModel';
import Inventory from '@src/model/inventoryModel';
import Sales from '@src/model/salesModel';
import {NextFunction, Request, Response} from 'express';


export const getSalesPageData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {search}  = req.query;
    const searchFilter = search
    ? {
        $or: [
          { customer: { $regex: search, $options: "i" } }, 
          { product: { $regex: search, $options: "i" } },
        ],
      }
    : {};
    // const product = await Inventory.find(searchFilter) 

    const items = await Inventory.find({quantity:{$gt:0}});
    const customers = await customer.find({});
    const sales = await Sales.aggregate([
      { $match: searchFilter },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdAt"
            }
          },
          product: 1,
          quantity: 1,
          total: 1,
          customer: 1,
          price:1,

        }
      }
    ]);
    console.log(sales,'ddddd')
    res.status(HttpStatus?.OK).json({items, customers, sales});
  } catch (error: unknown) {
    next(error);
  }
};

export const createSales = async (req: Request,
  res: Response,
  next: NextFunction):Promise<void> => {
  try {
    const { customer, product, quantity } = req.body;

    // Validate the request body
    if (!customer || !product || !quantity) {
       res.status(HttpStatus?.BAD_REQUEST).json({
        success: false,
        message: "Customer, product, and quantity are required.",
      });
      return
    }

    // Find the product in inventory
    const inventoryItem = await Inventory.findOne({ name: product });
    if (!inventoryItem) {
       res.status(HttpStatus?.NOT_FOUND).json({
        success: false,
        message: `Product '${product}' not found in inventory.`,
      });
      return
    }

    // Check inventory quantity
    if (inventoryItem&& inventoryItem?.quantity < quantity) {
       res.status(HttpStatus?.BAD_REQUEST).json({
        success: false,
        message: `Insufficient quantity for product '${product}'. Available: ${inventoryItem.quantity}, Requested: ${quantity}.`,
      });
      return 
    }

    // Update inventory (reduce quantity)
    const inventoryUpdate = await Inventory.updateOne(
      { name: product },
      { $inc: { quantity: -quantity } }
    );

    if (!inventoryUpdate) {
       res.status(HttpStatus?.BAD_REQUEST).json({
        success: false,
        message: "Failed to update inventory.",
      });
      return
    }
    let price:number = 0 
    // Calculate price and total
    if(inventoryItem){

      price = inventoryItem.price as number;
    }
    const total = price * quantity;

    // Save sales data
    const sales = new Sales({ customer, product, quantity, price, total });
    await sales.save();

   
    res.status(HttpStatus?.OK).json({product,
      success: true,
      message: "Sale created successfully.",
      sales,
    });
  } catch (error:unknown) {
    next(error);
  }
};