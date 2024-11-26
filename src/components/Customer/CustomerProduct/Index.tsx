import { trpc } from "@/utils/trpc";
import { Product } from "@prisma/client";
import { useState } from "react";

interface CustomerProductsProps {
    products: Product[];
    customerId: number;
  }
  
  export const CustomerProducts: React.FC<CustomerProductsProps> = ({ products, customerId }) => {
    const utils = trpc.useUtils();
    const [deletingId, setDeletingId] = useState<number | null>(null);
  
    const deleteMutation = trpc.products.deleteFromCustomer.useMutation({
      onSuccess: () => {
        utils.products.listAllByCustomerId.invalidate();
        setDeletingId(null);
      },
    });
  
    const handleDelete = (id: number) => {
      setDeletingId(id);
    };
  
    const confirmDelete = () => {
      if (deletingId !== null) {
        deleteMutation.mutate({ customerId, productId: deletingId });
      }
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Products</h3>
        {deletingId !== null && (
          <div className="space-y-2 mt-4">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex space-x-4">
              <button onClick={confirmDelete} className="btn btn-danger text-xs">Yes, Delete</button>
              <button onClick={() => setDeletingId(null)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        )}
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="flex justify-between items-center">
              <span>{product.name}</span>
              <button onClick={() => handleDelete(product.id)} className="btn btn-danger text-xs">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  