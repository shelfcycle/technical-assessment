import { Controller } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  control: any;
  error?: string;
  rules?: object;
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormField = ({ name, label, control, error, rules }: FormFieldProps) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-900">{label}</label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <input
          id={name}
          {...field}
          className="px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export const FormSection = ({ title, children }: FormSectionProps) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);


