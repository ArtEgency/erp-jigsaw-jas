"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";

interface FormWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
  children: React.ReactNode;
}

export default function FormWrapper({ methods, onSubmit, children }: FormWrapperProps) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : (e) => e.preventDefault()}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
