import { PageTitle } from "@/components/PageTitle";
import { FormField } from "@/components/RHF/FormField";
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
  const { name, email, phone, street1, street2, city, state, zipCode } = customer;
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p>{email}</p>
      <p>{phone}</p>
      <p>{street1} {street2}</p>
      <p>{city}{city && ','} {state} {zipCode}</p>
      <button onClick={onEdit} className="btn btn-secondary">Edit Customer Details</button>
    </div>
  );
};

const CustomerContactEdit: React.FC<CustomerContactEditProps> = ({ customer, onSubmit, onCancel }) => {
  const { name, email, phone, street1, street2, city, state, zipCode } = customer;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField name="name" label="Name" control={control} error={errors.name?.message} rules={{ required: 'Name is required' }} />
      <FormField name="email" label="Email" control={control} error={errors.email?.message} />
      <FormField name="phone" label="Phone" control={control} error={errors.phone?.message} />
      <FormField name="street1" label="Street 1" control={control} error={errors.street1?.message} />
      <FormField name="street2" label="Street 2" control={control} error={errors.street2?.message} />
      <FormField name="city" label="City" control={control} error={errors.city?.message} />
      <FormField name="state" label="State" control={control} error={errors.state?.message} />
      <FormField name="zipCode" label="Zip Code" control={control} error={errors.zipCode?.message} />

      <div className="flex space-x-4">
        <button type="submit" className="btn">Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
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

  const onSubmit = (data: any) => {
    mutation.mutate({
      id: customer.id,
      ...data,
    });
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

      {mutation.isSuccess && <p className="text-green-500">Customer updated successfully ✔️</p>}
      {mutation.isError && <p className="text-red-500">Error: {mutation.error?.message}</p>}
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

  const { isError, isSuccess } = addProductToCustomerMutation;

  const onSubmit = (data: AddExistingProductFormValues) => {
    addProductToCustomerMutation.mutate({
      customerId,
      productId: Number(data.productId),
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add Existing Product</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="productId"
          control={control}
          render={({ field }) => (
            <select {...field} className="form-select">
              <option value="" disabled>Select a Product</option>
              {productsNotAssociated?.items?.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          )}
        />
        {isSuccess && <p className="text-green-500">{addProductToCustomerMutation.data.message} ✔️</p>}
        {isError && <p className="text-red-500">Error: {addProductToCustomerMutation.error.message}</p>}
        <button type="submit" disabled={!selectedProductId || addProductToCustomerMutation.isPending} className="btn">
          Add Product
        </button>
      </form>
      <button onClick={onCancel} className="btn-secondary">Go Back</button>
    </div>
  );
};

const CreateProductForm = ({ customerId, onCancel }: { customerId: number; onCancel: () => void }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateProductFormValues>();
  const unitOptions = Object.values(unitOfMeasure);
  const utils = trpc.useUtils();

  const { mutate, isPending, isSuccess, isError, error } = trpc.products.createForCustomer.useMutation({
    onSuccess: () => {
      utils.products.listAllByCustomerId.invalidate();
      utils.products.listAllByNotCustomerId.invalidate();
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
  
  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      mutate({
        customerId,
        name: data.name,
        unitOfMeasure: data.unitOfMeasure,
      });
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Product Name</label>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Product name is required" }}
          render={({ field }) => (
            <input id="name" className="form-input" placeholder="Product Name" {...field} />
          )}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="unitOfMeasure" className="block">Unit of Measure</label>
        <Controller
          name="unitOfMeasure"
          control={control}
          rules={{ required: "Unit of measure is required" }}
          render={({ field }) => (
            <select {...field} className="form-select">
              <option value="">Select Unit</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          )}
        />
        {errors.unitOfMeasure && (
          <p className="text-red-500">{errors.unitOfMeasure.message}</p>
        )}
      </div>
      {isSuccess && <p className="text-green-500">Product created successfully ✔️</p>}
      {isError && <p className="text-red-500">Error: {error?.message}</p>}

      <div className="flex space-x-4">
        <button type="submit" disabled={isPending} className="btn">Create Product</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Go Back</button>
      </div>
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
