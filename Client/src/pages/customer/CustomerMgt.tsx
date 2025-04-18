/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, FileSpreadsheet, FileText, Mail, Plus, Printer, SearchIcon, Trash2Icon } from "lucide-react";
import { DeleteProductModal } from "../../components/delete-product.modal";
import { ExportModal } from "../../components/export.modal";
import { CustomerModal } from "../../components/CustomerModal";
import toast from "react-hot-toast";
import { fetchCustomers, fetchUserExportData, postAddCustomer, postDeleteCustomer, postEditCustomer } from "../../service/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Spinner } from "../../components/Spinner";
import { debounce } from "../../util/debounce";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Texport } from "../Inventory/InventoryMgt";

export interface ICustomer {
  _id?: string;
  name: string;
  address: string;
  mobile: string;
}
interface Icustom{
  _id?:string,
  product:string,
  customer:string,
  price:number,
  quantity:number,
  total:number,
  updatedAt?:string,
  createdAt?:string,
  __v?:number

}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ICustomer;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [customCus,setCustomCus] = useState<ISales[]|[]>([]);
  // Simulate fetching customers from an API
  const fetchData = useCallback(async () => {
    setLoading(true); 
    const resposne = await fetchCustomers(debouncedSearchTerm);
    if(resposne?.data && resposne?.status == 200){

      setCustomers(resposne?.data?.customer);
    }
    setLoading(false);
  },[debouncedSearchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const requestSort = (key: keyof ICustomer) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = useMemo(() => {
    const sortableItems = [...customers];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }
    return sortableItems;
  }, [customers, sortConfig]);

  const filteredCustomers = useMemo(() => {
    let result = sortedCustomers;

    if (searchTerm) {
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [searchTerm, sortedCustomers]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandler = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 900),
    []
  );
  useEffect(() => {
  
    debouncedHandler(searchTerm);

  }, [debouncedHandler, searchTerm]);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers?.length / itemsPerPage);


  const handleEditClick = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setModalMode("edit");
    setCustomerModalOpen(true);
  };

  const handleDeleteClick = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async() => {
  
    const response = await postDeleteCustomer(selectedCustomer?._id as string)
    if (selectedCustomer && response?.data.success) {
      setCustomers((prev) =>
        prev.filter((c) => c._id !== selectedCustomer._id)
      );
      setDeleteModalOpen(false);
    }
    toast.success(response?.data?.message)
  };

  const handleSave = async(customer: ICustomer) => {
 
    if (modalMode === "edit" && selectedCustomer) {
    
      const response = await postEditCustomer(customer);
      if(response?.data && response?.data?.success){
      setCustomers((prev) =>
        prev.map((c) => (c?._id === selectedCustomer?._id ? customer : c))
      );
      toast.success(response?.data?.message)
    }
    } else {
      const response = await postAddCustomer(customer);
      if(response?.data && response?.data.success){

        setCustomers((prev) => [
          response?.data.customer,...prev
        ]);
        toast.success(response?.data?.message)
      }
    }
    setCustomerModalOpen(false);
  };
  const handleExport = async(type:Texport,customer:string) => {
    setExportType(type);
    setExportModalOpen(true);
    const response = await fetchUserExportData(customer)
    const data = (response?.data?.customers as Icustom[])?.map(({_id,updatedAt,createdAt,__v,...rest})=>rest)

    setCustomCus(data as ISales[])
  
  };
const handleAddModalOpen = ()=>{
    setModalMode("add");
    setCustomerModalOpen(true);
    

}
  return (
    <div className="  py-10 px-4 w-full flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Customer Management
        </h1>
        {loading ? (
        <Spinner />
      ) : (

        <div className="space-y-4 p">
          {/* Search, Filter, and Add */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
           
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
            

              <Button
                onClick={handleAddModalOpen}
                className="bg-gray-900 text-white"
              >
                <Plus className="mr-2 h-4 w-4 " />
                Add Customer
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("address")}
                  >
                    Address <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("mobile")}
                  >
                    Mobile <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell className="space-x-2">
                        <div className="flex justify-start gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(customer)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(customer)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>

                      <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button  variant="outline">customer Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white text-black">
                  <DropdownMenuItem onClick={() => handleExport("print",customer?.name)} className="">
                    <Printer className="mr-2 h-4 w-6" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel",customer?.name)}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf",customer?.name)}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("email",customer?.name)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
              {filteredCustomers?.length} items
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value: string) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>

                <div className="text-sm mx-2">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Modals */}
          <CustomerModal
            isOpen={customerModalOpen}
            onClose={() => {
            
              setCustomerModalOpen(false) ;
              }}
            onSave={handleSave}
            customer={selectedCustomer as ICustomer}
            mode={modalMode}
          />

          <DeleteProductModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            product={selectedCustomer?.name as string}
          />

          <ExportModal
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            exportType={exportType as Texport}
            products={customCus as ICustomer[]}
          />
        </div>
      )}
      </div>
    </div>

  );
}
