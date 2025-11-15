import { authService } from "@/services/auth";
import type { LoginSchemaType } from "@/services/auth/type";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();

  return {
    login: useMutation({
      mutationFn: (data: LoginSchemaType) => authService.login(data),
      onSuccess(data) {
        localStorage.setItem("token", data.access);

        navigate("/");
      },
    }),

    verify: useMutation({
      mutationFn: () => authService.verify(),
    }),
  };
};
