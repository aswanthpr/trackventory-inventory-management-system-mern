"use client"

import { useState, useEffect } from "react"
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
import { Printer, FileSpreadsheet, FileText, Mail } from "lucide-react"
import { ICustomer } from "../pages/customer/CustomerMgt"
import {
  exportToExcel,
  exportToPDF,
  printData,
  sendExportEmail,
} from "../util/exportUtil" 
import toast from "react-hot-toast"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  exportType: "print" | "excel" | "pdf" | "email"
  products: Iinventory[] | ICustomer[] | ISales[]
}

export function ExportModal({
  isOpen,
  onClose,
  exportType,
  products,
}: ExportModalProps) {
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (isOpen) {
      console.log(`Exporting ${products?.length} products as ${exportType}`)
    }
  }, [isOpen, exportType, products])

  const handleExport = async () => {
    try {
      if (exportType === "print") {
        printData(products)
      } else if (exportType === "excel") {
        exportToExcel(products, `${Date().toString().split("GMT")[0]}`)
      } else if (exportType === "pdf") {
        exportToPDF(products, `${Date().toString().split("GMT")[0]}`)
      } else if (exportType === "email") {
        if (!email) {
          toast.custom("Please enter an email")
          return
        }
        await sendExportEmail(email, products)
    
        setEmail("")
      }

      onClose()
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export data.")
    }
  }

  const getExportIcon = () => {
    switch (exportType) {
      case "print":
        return <Printer className="h-6 w-6" />
      case "excel":
        return <FileSpreadsheet className="h-6 w-6" />
      case "pdf":
        return <FileText className="h-6 w-6" />
      case "email":
        return <Mail className="h-6 w-6" />
      default:
        return null
    }
  } 

  const getExportTitle = () => {
    switch (exportType) {
      case "print":
        return "Print Products"
      case "excel":
        return "Export to Excel"
      case "pdf":
        return "Export to PDF"
      case "email":
        return "Email Products"
      default:
        return "Export Products"
    }
  }

  const getExportDescription = () => {
    switch (exportType) {
      case "print":
        return "This will prepare a printer-friendly version of your product list."
      case "excel":
        return "Download your product data as an Excel spreadsheet."
      case "pdf":
        return "Download your product data as a PDF document."
      case "email":
        return "Send your product data to an email address."
      default:
        return "Export your product data."
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getExportIcon()}
            {getExportTitle()}
          </DialogTitle>
          <DialogDescription>{getExportDescription()}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {exportType === "email" ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="col-span-3"
                placeholder="Enter recipient email"
                required
              />
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {products.length} products will be exported.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleExport} className="bg-gray-900 text-white">
            {exportType === "print"
              ? "Print"
              : exportType === "email"
              ? "Send"
              : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
