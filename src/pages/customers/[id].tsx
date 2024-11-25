import { PageTitle } from "@/components/PageTitle";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Customer, Product, unitOfMeasure } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

interface CustomerContactProps {
  customer: Customer;
}

interface CustomerProductsProps {
  products: Product[];
}

interface AddExistingProductFormValues {
  productId: number;
}

interface CreateProductFormValues {
  name: string;
  unitOfMeasure: unitOfMeasure;
}

const CustomerContact: React.FC<CustomerContactProps> = ({ customer }) => {
  const { email, phone, street1, street2, city, state, zipCode } = customer;
  return (
    <div>
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
};

const AddExistingProductForm = ({ customerId, onCancel }: { customerId: number; onCancel: () => void }) => {
  const utils = trpc.useUtils();
  const { control, handleSubmit, watch } = useForm<AddExistingProductFormValues>();
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

  const {isError, isSuccess} = addProductToCustomerMutation;

  const onSubmit = (data: AddExistingProductFormValues) => {
    addProductToCustomerMutation.mutate({
      customerId,
      productId: Number(data.productId),
    });
  };

  return (
    <div>
      <h3>Add Existing Product</h3>
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
        {isSuccess && <p>{addProductToCustomerMutation.data.message} ✔️</p>}
        {isError && <p style={{ color: "red" }}>Error: {addProductToCustomerMutation.error.message}</p>}
        <button type="submit" disabled={!selectedProductId || addProductToCustomerMutation.isPending}>
          Add Product
        </button>
      </form>
      <button onClick={onCancel}>Go Back</button>
    </div>
  );
};

const CreateProductForm = ({ customerId, onCancel }: { customerId: number; onCancel: () => void }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateProductFormValues>();

  const { mutate, isPending, isSuccess, isError, error } = trpc.products.createProductForCustomer.useMutation();

  const unitOptions = Object.values(unitOfMeasure);

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      await mutate({
        customerId,
        name: data.name,
        unitOfMeasure: data.unitOfMeasure,
      });
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Product Name </label>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Product name is required" }}
          render={({ field }) => (
            <input
              id="name"
              placeholder="Product Name"
              {...field}
            />
          )}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="unitOfMeasure">Unit of Measure </label>
        <Controller
          name="unitOfMeasure"
          control={control}
          rules={{ required: "Unit of measure is required" }}
          render={({ field }) => (
            <select {...field}>
              <option value="">Select Unit</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          )}
        />
        {errors.unitOfMeasure && (
          <p style={{ color: "red" }}>{errors.unitOfMeasure.message}</p>
        )}
      </div>
      {/* I'd really prefer to show the success message from the backend transaction directly, but I'm not familiar enough with tRPC */}
      {isSuccess && <p>Product created successfully ✔️</p>}
      {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>}

      <button type="submit" disabled={isPending}>Create Product</button>
      <button type="button" onClick={onCancel}>Go Back</button>
    </form>
  );
};

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
      <div>
        <PageTitle>Customer: {item.name}</PageTitle>

        {isAddingProduct === null && (
          <div>
            <CustomerContact customer={item} />
            <p>
            <button onClick={() => setIsAddingProduct("create")}>Create New Product</button>
            </p>
            <p>
            <button onClick={() => setIsAddingProduct("add")}>Add Existing Product</button>
            </p>
            <CustomerProducts products={products} />
          </div>
        )}

        {isAddingProduct === "add" && <AddExistingProductForm customerId={sanitizedId} onCancel={() => setIsAddingProduct(null)} />}
        {isAddingProduct === "create" && <CreateProductForm customerId={sanitizedId} onCancel={() => setIsAddingProduct(null)} />}
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default CustomerDetailPage;
