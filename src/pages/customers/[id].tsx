import { PageTitle } from "@/components/PageTitle";
import {AddExistingProductForm, CreateProductForm } from "@/components/Customer/CustomerProduct/Add";
import { CustomerContact } from "@/components/Customer/CustomerDetails/Contact";
import { CustomerProducts } from "@/components/Customer/CustomerProduct/Index";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useState } from "react";


const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const sanitizedId = Number(id);

  const customerQuery = trpc.customers.getById.useQuery({ id: sanitizedId });
  const productsQuery = trpc.products.listAllByCustomerId.useQuery({ customerId: sanitizedId });

  const [isAddingProduct, setIsAddingProduct] = useState<"create" | "add" | null>(null);

  if (!!customerQuery.data && !!productsQuery.data) {
    const { item } = customerQuery.data;
    const { items: products } = productsQuery.data;

    return (
      <div className="container">
        <PageTitle>Customer: {item.name}</PageTitle>

        {isAddingProduct === null && (
          <div className="space-y-4">
            <CustomerContact customer={item} />
            <div className="space-x-4">
              <button onClick={() => setIsAddingProduct("create")} className="btn btn-secondary">Create New Product</button>
              <button onClick={() => setIsAddingProduct("add")} className="btn btn-secondary">Add Existing Product</button>
            </div>
            <CustomerProducts products={products} customerId={sanitizedId} />
          </div>
        )}

        {isAddingProduct === "add" && <AddExistingProductForm customerId={sanitizedId} onCancel={() => setIsAddingProduct(null)} />}
        {isAddingProduct === "create" && <CreateProductForm customerId={sanitizedId} onCancel={() => setIsAddingProduct(null)} />}
      </div>
    );
  }

  return <div className="container">Loading...</div>;
};

export default CustomerDetailPage;
