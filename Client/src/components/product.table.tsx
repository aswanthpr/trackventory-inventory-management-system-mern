"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DeleteProductModal } from "./delete-product.modal"
import { EditProductModal } from "./edit.product.modal"
import { AddProductModal } from "./add-product-modal"
import { ExportModal } from "./export.modal"

// Sample product data
const initialProducts = [
  { id: 1, name: "Laptop", price: 999.99, description: "High-performance laptop with 16GB RAM", quantity: 15 },
  { id: 2, name: "Smartphone", price: 699.99, description: "Latest model with 128GB storage", quantity: 25 },
  { id: 3, name: "Headphones", price: 149.99, description: "Noise-cancelling wireless headphones", quantity: 30 },
  { id: 4, name: "Monitor", price: 299.99, description: "27-inch 4K display", quantity: 10 },
  { id: 5, name: "Keyboard", price: 79.99, description: "Mechanical gaming keyboard", quantity: 20 },
  { id: 6, name: "Mouse", price: 49.99, description: "Ergonomic wireless mouse", quantity: 35 },
  { id: 7, name: "Tablet", price: 399.99, description: "10-inch tablet with stylus support", quantity: 12 },
  { id: 8, name: "Speakers", price: 129.99, description: "Bluetooth speakers with deep bass", quantity: 18 },
  { id: 9, name: "Camera", price: 549.99, description: "Digital camera with 24MP sensor", quantity: 8 },
  { id: 10, name: "Printer", price: 199.99, description: "All-in-one color printer", quantity: 5 },
  { id: 11, name: "External Hard Drive", price: 89.99, description: "1TB portable storage", quantity: 22 },
  { id: 12, name: "Router", price: 69.99, description: "Dual-band WiFi router", quantity: 14 },
]

export default function ProductTable() {
  const [products, setProducts] = useState(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)
  const [exportType, setExportType] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [priceFilter, setPriceFilter] = useState("")
  const [quantityFilter, setQuantityFilter] = useState("")

  // Filter products based on search term and filters
  useEffect(() => {
    let result = products

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Price filter
    if (priceFilter) {
      switch (priceFilter) {
        case "lt100":
          result = result.filter((product) => product.price < 100)
          break
        case "100to500":
          result = result.filter((product) => product.price >= 100 && product.price <= 500)
          break
        case "gt500":
          result = result.filter((product) => product.price > 500)
          break
      }
    }

    // Quantity filter
    if (quantityFilter) {
      switch (quantityFilter) {
        case "lt10":
          result = result.filter((product) => product.quantity < 10)
          break
        case "10to20":
          result = result.filter((product) => product.quantity >= 10 && product.quantity <= 20)
          break
        case "gt20":
          result = result.filter((product) => product.quantity > 20)
          break
      }
    }

    // Sort products
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, products, sortConfig, priceFilter, quantityFilter])

  // Request sort
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle delete
  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    setProducts(products.filter((product) => product.id !== selectedProduct?.id))
    setDeleteModalOpen(false)
  }

  // Handle edit
  const handleEditClick = (product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleEditSave = (editedProduct) => {
    setProducts(products.map((product) => (product.id === editedProduct.id ? editedProduct : product)))
    setEditModalOpen(false)
  }

  // Handle add
  const handleAddSave = (newProduct) => {
    const newId = Math.max(...products.map((p) => p.id)) + 1
    setProducts([...products, { ...newProduct, id: newId }])
    setAddModalOpen(false)
  }

  // Handle export
  const handleExport = (type) => {
    setExportType(type)
    setExportModalOpen(true)
  }

  return (
    <div className="space-y-4">
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
              <SelectContent>
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
              <SelectContent>
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
            <DropdownMenuContent align="end">
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

          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
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
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("name")}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("price")}>
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("quantity")}>
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
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.description}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
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
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
          {filteredProducts.length} items
        </div>
        <div className="flex items-center space-x-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
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
        product={selectedProduct}
      />

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        product={selectedProduct}
      />

      <AddProductModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddSave} />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        exportType={exportType}
        products={filteredProducts}
      />
    </div>
  )
}
