import { PageTitle } from "@/components/PageTitle";
import {FormField} from "@/components/RHF/FormField";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Customer, Product, unitOfMeasure } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

interface CustomerContactProps {
  customer: Customer;
}

interface CustomerContactShowProps {
  customer: Customer;
  onEdit: () => void;
}

interface CustomerContactEditProps {
  customer: Customer;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface CustomerProductsProps {
  products: Product[];
  customerId: number;
}

interface AddExistingProductFormValues {
  productId: number;
}

interface CreateProductFormValues {
  name: string;
  unitOfMeasure: unitOfMeasure;
}

const CustomerContactShow: React.FC<CustomerContactShowProps> = ({ customer, onEdit }) => {
  const {name, email, phone, street1, street2, city, state, zipCode} = customer;
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      <p>{phone}</p>
      <p>{street1} {street2}</p>
      <p>{city}{city && ','} {state} {zipCode}</p>
      <button onClick={onEdit}>Edit Customer Details</button>
    </div>
  );
};

const CustomerContactEdit: React.FC<CustomerContactEditProps> = ({ customer, onSubmit, onCancel }) => {
  const {name, email, phone, street1, street2, city, state, zipCode} = customer;
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: name || "",
      email: email || "",
      phone: phone || "",
      street1: street1 || "",
      street2: street2 || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField name="name" label="Name" control={control} error={errors.name?.message} rules={{ required: 'Name is required' }}/>
      <FormField name="email" label="Email" control={control} error={errors.email?.message} />
      <FormField name="phone" label="Phone" control={control} error={errors.phone?.message} />
      <FormField name="street1" label="Street 1" control={control} error={errors.street1?.message} />
      <FormField name="street2" label="Street 2" control={control} error={errors.street2?.message} />
      <FormField name="city" label="City" control={control} error={errors.city?.message} />
      <FormField name="state" label="State" control={control} error={errors.state?.message} />
      <FormField name="zipCode" label="Zip Code" control={control} error={errors.zipCode?.message} />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};


const CustomerContact: React.FC<CustomerContactProps> = ({ customer }) => {
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);

  const mutation = trpc.customers.update.useMutation({
    onSuccess: async () => {
      await utils.customers.getById.invalidate({ id: customer.id });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating customer:", error);
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync({
        id: customer.id,
        ...data,
      });
    } catch (err) {
      console.error("Error updating customer:", err);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <CustomerContactShow customer={customer} onEdit={() => setIsEditing(true)} />
      ) : (
        <CustomerContactEdit customer={customer} onSubmit={onSubmit} onCancel={onCancel} />
      )}

      {mutation.isSuccess && <p>Customer updated successfully ✔️</p>}
      {mutation.isError && <p style={{ color: "red" }}>Error: {mutation.error?.message}</p>}
    </div>
  );
};

const CustomerProducts: React.FC<CustomerProductsProps> = ({ products, customerId }) => {
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
      deleteMutation.mutate({customerId, productId: deletingId});
    }
  };
  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} <button onClick={() => handleDelete(product.id)}>Delete</button></li>
        ))}
      </ul>
      {deletingId !== null && (
        <div>
          <p>Are you sure you want to delete this customer?</p>
          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeletingId(null)}>Cancel</button>
        </div>
      )}
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

  const addProductToCustomerMutation = trpc.products.addToCustomer.useMutation({
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

  const { mutate, isPending, isSuccess, isError, error } = trpc.products.createForCustomer.useMutation();

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
            <CustomerProducts products={products} customerId={sanitizedId} />
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
