import { userLogin } from "@src/controller/authentication";
import { createCustomer, customCustomer, deleteCustomer, editCustomer, fetchCustomers } from "@src/controller/customerController";
import { sendMail } from "@src/controller/exportController";
import { addProduct, deleteProduct, editProduct, fetchInventory } from "@src/controller/inventoryController";
import { createSales, getSalesPageData } from "@src/controller/SalesController";
import express ,{Router} from "express";
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

