import { userLogin } from "../controller/authentication"; 
import { createCustomer, customCustomer, deleteCustomer, editCustomer, fetchCustomers } from "../controller/customerController";
import { sendMail } from "../controller/exportController";
import { addProduct, deleteProduct, editProduct, fetchInventory } from "../controller/inventoryController";

import express ,{Router} from "express";
import { getSalesPageData,createSales } from "../controller/SalesController";
const router:Router  = express.Router();

router.post("/login",userLogin);
router.get("/",fetchInventory);
router.post("/add-inventory",addProduct);
router.patch("/edit-inventory",editProduct);
router.delete("/delete-inventory",deleteProduct);
router.post("/add-customer",createCustomer);
router.get("/customer-mgt",fetchCustomers);
router.patch("/edit-customer",editCustomer);
router.delete("/delete-customer",deleteCustomer);
router.get("/sales-mgt",getSalesPageData);
router.post("/add-sales",createSales)
router.post('/send-export-email',sendMail)
router.post('/custom-customer',customCustomer)
export default router;

