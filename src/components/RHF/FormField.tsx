import { Controller, UseControllerProps, FieldValues } from "react-hook-form";

interface FormFieldProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
  label: string;
  error?: string;
  type?: string;
}

export const FormField = <TFieldValues extends FieldValues>({
  label,
  error,
  type = "text",
  ...props
}: FormFieldProps<TFieldValues>) => {
  return (
    <div>
      <label>{label}</label>
      <Controller
        {...props}
        render={({ field }) => <input {...field} type={type} />}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

