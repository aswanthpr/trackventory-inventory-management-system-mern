"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Printer,
  FileSpreadsheet,
  FileText,
  Mail,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ExportModal } from "../../components/export.modal";
import { AddSalesModal } from "../../components/SalesModal";
import { ICustomer } from "../customer/CustomerMgt";
import { fetchSalesPageData, postAddSales } from "../../service/api";
import { Texport } from "../Inventory/InventoryMgt";
import toast from "react-hot-toast";
import { Spinner } from "../../components/Spinner";
import { debounce } from "../../util/debounce";




export default function SalesMgt() {
  const [pageData, setPageData] = useState<IpageData>({
    customers:[],
    items:[]
  });
  const [sales, setSales] = useState<ISales[]|[]>([]);
  const [filteredSales, setFilteredSales] = useState<ISales[]|[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [exportSales,setExportSales] = useState<ISales[]|[]>([])

  // Filter sales based on search term and filters
  useEffect(() => {
    let result = sales;

   

    // Price filter
    if (priceFilter) {
      switch (priceFilter) {
        case "lt100":
          result = result.filter((sale) => sale?.price < 100);
          break;
        case "100to500":
          result = result.filter((sale) => sale?.price >= 100 && sale?.price <= 500);
          break;
        case "gt500":
          result = result.filter((sale) => sale?.price > 500);
          break;
      }
    }

    // Quantity filter
    if (quantityFilter) {
      switch (quantityFilter) {
        case "lt10":
          result = result.filter((sale) => sale?.quantity < 10);
          break;
        case "10to20":
          result = result.filter((sale) => sale?.quantity >= 10 && sale.quantity <= 20);
          break;
        case "gt20":
          result = result.filter((sale) => sale?.quantity > 20);
          break;
      }
    }
    const sortConfig: {
      key: keyof ISales; 
      direction: "ascending" | "descending"; 
    } = {
      key: "price",
      direction: "ascending",
    };
// Sort sales
if (sortConfig.key) {
  result?.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
}

    setFilteredSales(result );
  }, [searchTerm, sales, sortConfig, priceFilter, quantityFilter]);


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

const fetchSalesData = useCallback(async ()=>{
  setLoading(true); // Start loading
  const response = await fetchSalesPageData(debouncedSearchTerm);
   // Start loading
  if(response?.data && response?.status ==200){
    setSales(response?.data?.sales);
 setPageData({customers:response?.data?.customers,items:response?.data?.items});
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const data = (response?.data?.sales as ISales[])?.map(({ _id , ...rest})=>rest);
 setExportSales(data)
}
setLoading(false);
},[debouncedSearchTerm])
  useEffect(()=>{
  fetchSalesData()
  },[fetchSalesData])
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const handleSave = async(data:ISales) => {

   const response = await postAddSales(data)

   if(response?.data && response?.data.success){
    setSales([response?.data?.sales,...sales])
    toast.success(response?.data?.message)
   }

    setModalOpen(false);
  };

  const handleExport = (type: Texport) => {
    setExportType(type);
    setExportModalOpen(true);
  };

  return (
    <div className="py-10 px-4 w-full flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Sales Management</h1>
        {loading ? (
        <Spinner />
      ) : (

        <div className="space-y-4">
          {/* Search, Filter, and Add */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search sales..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Price</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="lt100">Under $100</SelectItem>
                    <SelectItem value="100to500">$100 - $500</SelectItem>
                    <SelectItem value="gt500">Over $500</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={quantityFilter} onValueChange={setQuantityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Quantity</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    <SelectItem value="all">All Quantities</SelectItem>
                    <SelectItem value="lt10">Less than 10</SelectItem>
                    <SelectItem value="10to20">10 - 20</SelectItem>
                    <SelectItem value="gt20">More than 20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Export</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-50">
                  <DropdownMenuItem onClick={() => handleExport("print")}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("email")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setModalOpen(true)} className="bg-gray-900 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Sale
              </Button>
            </div>
          </div>

          {/* Sales Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort("date")} className="cursor-pointer">
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead onClick={() => requestSort("customer")} className="cursor-pointer">
                    Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems?.map((sale:ISales) => (
                    <TableRow key={sale?._id}>
                      <TableCell>{(sale?.date as string)}</TableCell>
                      <TableCell>{sale?.customer}</TableCell>
                      <TableCell>{sale?.product}</TableCell>
                      <TableCell>${sale?.price}</TableCell>
                      <TableCell>{sale?.quantity}</TableCell>
                      <TableCell>${sale?.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No sales found
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
              {Math.min(indexOfLastItem, filteredSales?.length)} of{" "}
              {filteredSales?.length} items
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
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
        </div>
      )}
      </div>
             
      {/* Add Sales Modal */}
      <AddSalesModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave }
        customers={pageData?.customers as ICustomer[]}
        inventory={pageData?.items as Iinventory[]}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        exportType={exportType as Texport}
        products={exportSales}
      />
    </div>
  );
}