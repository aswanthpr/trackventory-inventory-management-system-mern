import { AxiosError, AxiosResponse } from 'axios';
import { api } from '../config/axiosInstance'
import toast from 'react-hot-toast';
import { ICustomer } from '../pages/customer/CustomerMgt';
export const postLogin = async(data:{email:string,password:string}):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.post("/login",data);
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Login failed. Please try again.");
        throw new Error(err.response?.data?.error || "Login failed.");
    }
}

export const postAddInventory = async(data:Iinventory):Promise<AxiosResponse>=>{
    try {
        console.log(data,'dataaaaa')
        const response = await api.post("/add-inventory",data);
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "failed to Create. Please try again.");
        throw new Error(err.response?.data?.error || " failed to Create.");
    }
}

export const fetchInventory = async(search:string):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.get("/",{params:{search}});
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource not found.");
        throw new Error(err.response?.data?.error || "Resource not found.");
    }
}

export const serviceEditProduct = async(data:Iinventory):Promise<AxiosResponse>=>{
    try {
        console.log(data?._id,'this is id');

        const response = await api.patch("/edit-inventory",data);
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource failed to edit.");
        throw new Error(err.response?.data?.error || "Resource failed to edit.");
    }
}
export const serviceDeleteProduct = async(prodId:string):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.delete("/delete-inventory",{params:{_id:prodId}});
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource failed to delete.");
        throw new Error(err.response?.data?.error || "Resource failed to delete.");
    }
}

export const postAddCustomer = async(data:ICustomer):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.post("/add-customer",data);
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "failed to Create. Please try again.");
        throw new Error(err.response?.data?.error || " failed to Create.");
    }
}

export const fetchCustomers = async(search:string):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.get("/customer-mgt",{params:{search}});
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource not found.");
        throw new Error(err.response?.data?.error || "Resource not found.");
    }
}
export const postEditCustomer = async(data:ICustomer):Promise<AxiosResponse>=>{
    try {
        console.log(data?._id,'this is id');

        const response = await api.patch("/edit-customer",data);
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource failed to edit.");
        throw new Error(err.response?.data?.error || "Resource failed to edit.");
    }
}
export const postDeleteCustomer = async(customerId:string):Promise<AxiosResponse>=>{
    try {
        console.log(customerId,'custoemrid')
        const response = await api.delete("/delete-customer",{params:{_id:customerId}});
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource failed to delete.");
        throw new Error(err.response?.data?.error || "Resource failed to delete.");
    }
}

export const fetchSalesPageData = async(search: string):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.get("/sales-mgt",{params:{search}});
        
        return response;
    } catch (error:unknown) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || "Resource not found.");
        throw new Error(err.response?.data?.error || "Resource not found.");
    }
}
export const postAddSales = async(data:ISales):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.post("/add-sales",data);
        return response;
    } catch (error:unknown) {
        if (error && (error as AxiosError).isAxiosError) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const genericErrorMessage = error instanceof Error ? error.message : String(error);
            toast.error(genericErrorMessage);
            throw new Error(genericErrorMessage);
          }
    }
}
export const sendMail = async(email:string,data:ISales[]|Iinventory[]|ICustomer[]):Promise<AxiosResponse>=>{
    try {
        
        const response = await api.post("/send-export-email",{email,data});
        return response;
    } catch (error:unknown) {
        if (error && (error as AxiosError).isAxiosError) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const genericErrorMessage = error instanceof Error ? error.message : String(error);
            toast.error(genericErrorMessage);
            throw new Error(genericErrorMessage);
          }
    }
}

export const fetchUserExportData = async(customer:string):Promise<AxiosResponse>=>{
    try {
      
        const response = await api.post("/custom-customer",{customer});
        return response;
    } catch (error:unknown) {
        if (error && (error as AxiosError).isAxiosError) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const genericErrorMessage = error instanceof Error ? error.message : String(error);
            toast.error(genericErrorMessage);
            throw new Error(genericErrorMessage);
          }
    }
}

