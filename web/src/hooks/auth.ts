import { authService } from "@/services/auth";
import type { LoginSchemaType } from "@/services/auth/type";
import { useMutation } from "@tanstack/react-query";
import { fromUnixTime, isAfter } from "date-fns";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const navigate = useNavigate();

  const authenticated = () => {
    const tokenAccess = localStorage.getItem("token");

    if (!tokenAccess) return false;

    const tokenDecoded: { exp?: number } = jwtDecode(tokenAccess);
    if (!tokenDecoded.exp) return false;

    const dateExpToken = fromUnixTime(tokenDecoded.exp);
    const isExpired = isAfter(new Date(), dateExpToken);

    if (isExpired) return false;

    return true;
  };

  return {
    login: useMutation({
      mutationFn: (data: LoginSchemaType) => authService.login(data),
      onSuccess(data) {
        localStorage.setItem("token", data.access);

        navigate("/");
      },
    }),
    authenticated,
  };
};
