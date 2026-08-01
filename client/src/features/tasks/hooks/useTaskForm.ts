import { useEffect } from "react";
import { useForm, UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskFormValues } from "../schemas/tasks.schema";

export const useTaskForm = (defaultValues?: Partial<CreateTaskFormValues>): {
  register: UseFormRegister<CreateTaskFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateTaskFormValues>;
  errors: FieldErrors<CreateTaskFormValues>;
} => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "TODO",
      priority: "MEDIUM",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues)
      reset({ status: "TODO", priority: "MEDIUM", ...defaultValues });
  }, [defaultValues, reset]);

  return {
    register,
    handleSubmit,
    errors,
  };
};
