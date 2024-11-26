import { trpc } from "@/utils/trpc";
import { unitOfMeasure } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";

interface AddExistingProductFormValues {
    productId: number;
  }
  
  interface CreateProductFormValues {
    name: string;
    unitOfMeasure: unitOfMeasure;
  }

export const AddExistingProductForm = ({ customerId, onCancel }: { customerId: number; onCancel: () => void }) => {
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
  
  export const CreateProductForm = ({ customerId, onCancel }: { customerId: number; onCancel: () => void }) => {
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
  