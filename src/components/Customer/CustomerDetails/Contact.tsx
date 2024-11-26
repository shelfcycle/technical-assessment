import { FormField } from "@/components/RHF/FormField";
import { trpc } from "@/utils/trpc";
import { Customer, Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface CustomerContactProps {
    customer: Customer;
  }
  
  interface CustomerContactEditProps {
    customer: Customer;
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }
  
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
  
  export const CustomerContact: React.FC<CustomerContactProps> = ({ customer }) => {
    const utils = trpc.useUtils();
    const [isEditing, setIsEditing] = useState(false);
    const { name, email, phone, street1, street2, city, state, zipCode } = customer;
  
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

    const onEdit = () => {
      setIsEditing(true);
    };
  
    return (
      <div>
        {!isEditing ? (
           <div className="space-y-4">
           <h3 className="text-xl font-semibold">{name}</h3>
           <p>{email}</p>
           <p>{phone}</p>
           <p>{street1} {street2}</p>
           <p>{city}{city && ','} {state} {zipCode}</p>
           <button onClick={onEdit} className="btn btn-secondary">Edit Customer Details</button>
         </div>
        ) : (
          <CustomerContactEdit customer={customer} onSubmit={onSubmit} onCancel={onCancel} />
        )}
  
        {mutation.isSuccess && <p className="text-green-500">Customer updated successfully ✔️</p>}
        {mutation.isError && <p className="text-red-500">Error: {mutation.error?.message}</p>}
      </div>
    );
  };