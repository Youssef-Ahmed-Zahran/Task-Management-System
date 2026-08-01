import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { useLogin } from "../api/auth.api";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormValues) => {
    login(data, { onSuccess: () => navigate("/projects") });
  };

  const apiError = (error as any)?.response?.data?.message;

  return {
    form: {
      register,
      handleSubmit,
      errors,
    },
    state: {
      showPassword,
      setShowPassword,
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
