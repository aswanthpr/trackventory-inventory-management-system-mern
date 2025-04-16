"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ICustomer } from "../pages/customer/CustomerMgt";
import { Label } from "@radix-ui/react-label";

export type SalesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ISales) => void;
  customers: ICustomer[];
  inventory: Iinventory[];
};


export function AddSalesModal({
  isOpen,
  onClose,
  onSave,
  customers,
  inventory,
}: SalesModalProps) {
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  // Update price when product or quantity changes
  useEffect(() => {
    const selectedProduct = inventory.find((item) => item.name === product);
    if (selectedProduct) {

      setTotal(selectedProduct.price * quantity);
      setPrice(selectedProduct?.price)
    }
  }, [product, quantity, inventory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSave({ customer, product, quantity, price,total });
    setCustomer("");
     setProduct("");
   setQuantity(0);
    setPrice(0);
     setTotal(0);
    onClose(); 

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Sale</DialogTitle>
            <DialogDescription>
              Enter the details for the new sale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Select Customer */}
            <div>
              
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {customers.map((cust) => (
                    <SelectItem key={cust?._id} value={cust.name}>
                      {cust.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Product */}
            <div>
             
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {inventory.map((item) => (
                    <SelectItem key={item?._id} value={`${item?.name}`}>
                      {`${item?.name}(${item?.quantity})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Input */}
            <div>
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Number(e.target.value))
                }
                min="1"
                placeholder="Quantity"
                required
              />
            </div>

            {/* Total Price */}
            <div>
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                value={total}
                min={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTotal(Number(e.target.value))
                }
                placeholder="Total Price"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gray-900 text-white mt-2">
              Add Sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
