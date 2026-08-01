import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { useRegister } from "../api/auth.api";

export const useRegisterPage = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword: _, ...payload } = data;
    register(payload, { onSuccess: () => navigate("/login") });
  };

  const apiError = (error as any)?.response?.data?.message;

  return {
    form: {
      register: rhfRegister,
      handleSubmit,
      errors,
    },
    state: {
      showPassword,
      setShowPassword,
      showConfirm,
      setShowConfirm,
    },
    query: {
      apiError,
    },
    actions: {
      onSubmit,
      isPending,
    },
  };
};
