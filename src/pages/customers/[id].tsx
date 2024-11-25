import { PageTitle } from "@/components/PageTitle";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Customer, Product } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";

interface CustomerContactProps {
  customer: Customer;
}

interface CustomerProductsProps {
  products: Product[];
}

interface AddProductFormValues {
  productId: number;
}

const CustomerContact: React.FC<CustomerContactProps> = ({ customer }) => {
  const { email, name, phone, street1, street2, city, state, zipCode } = customer;
  return (
    <div>
      <PageTitle>Customer: {name}</PageTitle>
      <div>
        <ul>
          <li>
            Phone: <a href={`tel:${phone}`}>{phone}</a>
          </li>
          <li>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </li>
        </ul>
      </div>
      <div>
        <p>Address</p>
        <p>
          {street1}
          <br />
          {city}, {state} {zipCode}
        </p>
      </div>
    </div>
  );
};

const CustomerProducts: React.FC<CustomerProductsProps> = ({ products }) => {
  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

const AddProductForm = ({ customerId }: { customerId: number }) => {
  const utils = trpc.useUtils();
  const { control, handleSubmit, watch } = useForm<AddProductFormValues>();
  const selectedProductId = watch("productId");
  const { data: productsNotAssociated } = trpc.products.listAllByNotCustomerId.useQuery({
    customerId,
  });

  const addProductToCustomerMutation = trpc.products.addProductToCustomer.useMutation({
    onSuccess: () => {
      utils.products.listAllByNotCustomerId.invalidate({ customerId });
      utils.products.listAllByCustomerId.invalidate({ customerId });
    },
  });

  const onSubmit = (data: AddProductFormValues) => {
    addProductToCustomerMutation.mutate({
      customerId,
      productId: Number(data.productId),
    });
  };

  return (
    <div>
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
          name="productId"
          control={control}
          render={({ field }) => (
            <select {...field} defaultValue="">
              <option value="" disabled>
                Select a Product
              </option>
              {productsNotAssociated?.items?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          )}
        />
        <button type="submit" disabled={!selectedProductId || addProductToCustomerMutation.isPending}>
          Add Product
        </button>
      </form>

      {addProductToCustomerMutation.isError && (
        <p style={{ color: "red" }}>Error: {addProductToCustomerMutation.error.message}</p>
      )}
      {addProductToCustomerMutation.isSuccess && (
        <p>{addProductToCustomerMutation.data.message} ✔️</p>
      )}
    </div>
  );
};


const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const sanitizedId = Number(id);

  const customerQuery = trpc.customers.getById.useQuery({ id: sanitizedId });
  const productsQuery = trpc.products.listAllByCustomerId.useQuery({ customerId: sanitizedId });

  if (!!customerQuery.data && !!productsQuery.data) {
    const { item } = customerQuery.data;
    const { items: products } = productsQuery.data;

    return (
      <div>
        <CustomerContact customer={item} />
        <AddProductForm customerId={sanitizedId} />
        <CustomerProducts products={products} />
      </div>
    );
  }
};

export default CustomerDetailPage;

