import {z} from "zod";

export const loginSchema = z.object({
        email:z.string().email({message: "Invalid email address"}),
        password:z.string().min(6, { message: "Password must be at least 6 characters long" })
});
export type LoginSchema = z.infer<typeof loginSchema>;


export const productSchema = z.object({
    name: z.string().min(3, "Name is required"),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price must be at least 0"),
    description: z.string().min(1, "Description is required"),
    quantity: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .min(0, "Quantity must be at least 0"),
  })
  
  export type ProductSchema = z.infer<typeof productSchema>

  export const customerSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(200, "Address is too long"),
    mobile: z
      .string()
      .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  });

  export type CustomerSchema = z.infer<typeof customerSchema>;