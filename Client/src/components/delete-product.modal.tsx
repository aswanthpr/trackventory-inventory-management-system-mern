"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
interface DeleteProductModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  product: string | null;
}
export function DeleteProductModal({ isOpen, onClose, onConfirm, product }:DeleteProductModalProps) {
  if (!product) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose} >
      <AlertDialogContent className="bg-gray-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the  &quot;{product}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90
            bg-gray-900 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
