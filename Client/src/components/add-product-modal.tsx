"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { productSchema, ProductSchema } from "../validation/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProductSchema) => void
  product?:Iinventory
}

export function AddProductModal({ isOpen, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      quantity: 0,
    },
  })

  const onSubmit = (data: ProductSchema) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-50">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter the details for the new product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  {...register("name")}
                  className="col-span-3"
                //   required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
                  step="1"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  className="col-span-3"
                //   required
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  {...register("description")}
                  className="col-span-3"
                //   required
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
                  className="col-span-3"
                //   required
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gray-900 text-white">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
