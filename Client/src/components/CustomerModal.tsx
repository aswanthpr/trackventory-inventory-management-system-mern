"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { ICustomer } from "../pages/customer/CustomerMgt";
import { customerSchema, CustomerSchema } from "../validation/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: ICustomer) => void;
  customer:ICustomer;
  mode: "add" | "edit";
}

export function CustomerModal({
    isOpen,
    onClose,
    onSave,
    customer,
    mode,
  }: CustomerModalProps) {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CustomerSchema>({
      resolver: zodResolver(customerSchema),
      defaultValues: {
        name: "",
        address: "",
        mobile: "",
      },
    });

  useEffect(() => {
    if (customer && mode === "edit") {
      reset({
        name: customer.name,
        address: customer.address,
        mobile: customer.mobile.toString(),
      });
    } else {
      reset({
        name: "",
        address: "",
        mobile: "",
      });
    }
  }, [customer, mode, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if(customer?._id){
        onSave({ ...data, _id: customer?._id });

    }else{
        onSave(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white">
        <form onSubmit={handleSubmit(onSubmit)} >
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add Customer" : "Edit Customer"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Fill in the details to add a new customer."
                : "Update the customer details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
            
              {...register("name")}
              placeholder="Customer Name"
            //   required
            />
             {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            <Textarea
             
              {...register("address")}
              placeholder="Customer Address"
            //   required.
            />
             {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            <Input
              maxLength={10}
              type="text"   
              {...register("mobile")}
              placeholder="Mobile Number"
            //   required
            />
             {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
          </div>
          <DialogFooter>
            <Button className="bg-black text-white mt-2" type="submit">{mode === "add" ? "Add" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}