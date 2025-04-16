/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { DeleteProductModal } from "../../components/delete-product.modal";
import { ExportModal } from "../../components/export.modal";
import {
  fetchInventory,
  postAddInventory,
  serviceDeleteProduct,
  serviceEditProduct,
} from "../../service/api";
import toast from "react-hot-toast";
import { ProductModal } from "../../components/ProductModal";
import { Spinner } from "../../components/Spinner";
import { debounce } from "../../util/debounce";

export type Texport ="print" | "excel" | "pdf" | "email";

export default function InventoryPage() {
  const [products, setProducts] = useState<Iinventory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Iinventory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{key:string,direction:string}>({
    key: "name",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportType, setExportType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Iinventory | null>(
    null
  );
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportData ,setExportData] = useState<Iinventory[]|[]>([])
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetchInventory(debouncedSearchTerm);
    if (response?.data && response?.status == 200) {
      setProducts(response?.data?.product);

      const data = (response?.data?.product as Iinventory[])?.map(({ _id , ...rest})=>rest);
      setExportData(data)
    }
    setLoading(false);
  },[debouncedSearchTerm]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter products based on search term and filters
  useEffect(() => {
    let result = products;

    // Price filter
    if (priceFilter && priceFilter !== "all") {
      switch (priceFilter) {
        case "lt100":
          result = result.filter((product) => product.price < 100);
          break;
        case "100to500":
          result = result.filter(
            (product) => product.price >= 100 && product.price <= 500
          );
          break;
        case "gt500":
          result = result.filter((product) => product.price > 500);
          break;
      }
    }
    
    if (quantityFilter && quantityFilter !== "all") {
      switch (quantityFilter) {
        case "lt10":
          result = result.filter((product) => product.quantity < 10);
          break;
        case "10to20":
          result = result.filter(
            (product) => product.quantity >= 10 && product.quantity <= 20
          );
          break;
        case "gt20":
          result = result.filter((product) => product.quantity > 20);
          break;
      }
    }
    

    // Sort products
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Iinventory];
        const bValue = b[sortConfig.key as keyof Iinventory];
      
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
        }
        if (aValue == null || bValue == null) return 0;

        // fallback for strings
        return sortConfig.direction === "ascending"
          ? String(aValue).localeCompare(bValue  as string )
          : String(bValue).localeCompare(aValue as string);
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, products, sortConfig, priceFilter, quantityFilter, debouncedSearchTerm]);

  
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
  // Request sort
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
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // // Handle page change
  // const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  // Handle delete
  const handleDeleteClick = (product: Iinventory) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct?._id) return;

    const response = await serviceDeleteProduct(selectedProduct._id);

    if (response?.data && response?.data?.success) {
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      setDeleteModalOpen(false);
      toast.success(response?.data?.message);
      setSelectedProduct(null);
    } else {
      toast.error("Failed to delete product");
    }
  };

  // Handle edit
  const handleEditClick = (product: Iinventory) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSave = useCallback(
    async (editedProduct: Iinventory) => {
      const response = await serviceEditProduct(editedProduct);
      console.log(response, "resposner");
      if (response?.data && response?.data?.success) {
        setProducts(
          products.map((product) =>
            product._id === editedProduct._id ? editedProduct : product
          )
        );
        setEditModalOpen(false);
        toast.success(response?.data?.message);
      }
    },
    [products]
  );

  // Handle add
  const handleAddSave = useCallback(
    async (newProduct: Iinventory) => {

      const response = await postAddInventory(newProduct);

      if (response?.data && response?.data?.product) {
        toast.success(response?.data?.message )
        setProducts([...products, { ...response?.data?.product }]);
        setAddModalOpen(false);
      }
    },
    [products]
  );

  // Handle export
  const handleExport = (type:Texport) => {
    setExportType(type);
    setExportModalOpen(true);
  };
const handleOpenModal = () =>{
  setSelectedProduct(null)
  setAddModalOpen(true)
 }
 const handleClose =
  () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setSelectedProduct(null)
    setSelectedProduct({  _id:'',
      name:"",
      price:0,
      description:"",
      quantity:0
  } )
  }
 
  return (
    <div className="  py-10 px-4 w-full flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Product Management
        </h1>
        {loading ? (
        <Spinner />
      ) : (

        <div className="space-y-4 p">
          {/* Search, Filter, and Add */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
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

                <Select
                  value={quantityFilter}
                  onValueChange={setQuantityFilter}
                >
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
                  <Button variant="outline">Items Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-black">
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

              <Button
                onClick={handleOpenModal}
                className="bg-gray-900 text-white"
              >
                <Plus className="mr-2 h-4 w-4 " />
                Add Product
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => requestSort("price")}
                    >
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => requestSort("quantity")}
                    >
                      Quantity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>${product.price.toFixed(1)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.description}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No products found
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
              {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
              {filteredProducts.length} items
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

          {/* Modals */}
          <DeleteProductModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            product={selectedProduct?.name  as string}
          />

          <ProductModal
            isOpen={addModalOpen || editModalOpen}
            onClose={handleClose}
            onSave={addModalOpen ? handleAddSave : handleEditSave}
            product={addModalOpen ? null : (selectedProduct as Iinventory)}
            mode={addModalOpen ? "add" : "edit"}
          />
          <ExportModal
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            exportType={exportType as Texport}
            products={exportData}
          />
        </div>
      )}
      </div>
    </div>
  );
}
