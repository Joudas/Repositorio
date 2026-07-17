import type { UseMutateFunction } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

type LoginResponse = {
  access_token: string;
  token_type?: string;
};

export type loginData = {
  email: string;
  password: string;
};

export type LoginContextType = {
  loginData: loginData;
  resetLoginForm: () => void;
  setLoginData: Dispatch<SetStateAction<loginData>>;
  mutate: UseMutateFunction<LoginResponse, Error, void, unknown>;
  error: Error | null;
  isError: boolean;
  isPending: boolean;
};
