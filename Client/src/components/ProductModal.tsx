"use client";

import { useEffect } from "react";
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
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../validation/zodSchema";

export type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Iinventory) => void;
  product?: Iinventory|undefined|null;
  mode: "add" | "edit"; 
};

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  mode,
}: ProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Iinventory>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      quantity: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && product) {
      reset(product);
    } else {
      
      reset(product as Iinventory); 
    }
  }, [mode, product, reset]);

  const onSubmit = (data: Iinventory) => {
    if (product?._id) {

      onSave({ ...data, _id: product._id  } as Iinventory)
    }
  
    if (mode === "add"){
      onSave(data as Iinventory) 
      reset();
    } 
   
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-50">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Enter the details for the new product."
                : "Make changes to the product details here."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register("name")} required />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
              <div className="col-span-3">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  required
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea id="description" {...register("description")} required />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  {...register("quantity", { valueAsNumber: true })}
                  required
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gray-900 text-white">
              {mode === "add" ? "Add Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}