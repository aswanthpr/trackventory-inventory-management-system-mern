/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/exportHelpers.ts

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ICustomer } from "../pages/customer/CustomerMgt";
import { sendMail } from "../service/api";
import toast from "react-hot-toast";

// Generate Excel file
export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Generate PDF file

export const exportToPDF = (data: any[], filename: string) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [Object.keys(data[0] || {})],
    body: data.map((row) => Object.values(row)),
  });
  doc.save(`${filename}.pdf`);
};

// Trigger print
export const printData = (data: any[]) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write("<html><head><title>Print</title></head><body>");
    printWindow.document.write("<h2>Exported Data</h2>");
    printWindow.document.write("<table border='1'><thead><tr>");
    Object.keys(data[0] || {}).forEach((key) =>
      printWindow!.document.write(`<th>${key}</th>`)
    );
    printWindow.document.write("</tr></thead><tbody>");
    data.forEach((row) => {
      printWindow!.document.write("<tr>");
      Object.values(row).forEach((val) =>
        printWindow!.document.write(`<td>${val}</td>`)
      );
      printWindow!.document.write("</tr>");
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  }
};

// Send via email
export const sendExportEmail = async (email: string, data: Iinventory[]|ISales[]|ICustomer[]) => {
    try {
        const res = await sendMail(email,data) 
       toast.success(res.data?.message)
    } catch (error) {
        console.log(error)
    }
 

};
