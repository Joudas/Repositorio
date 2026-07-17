import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { Form, FormField, FormRow } from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import { SocialButton } from "@/components/UI/SocialButton";
import useWindowDimensions from "../hooks/useWindowDimensions";

const listItemMotion = {
  whileHover: {
    scale: 1.12,
    y: 10,
    transition: { duration: 0.12 },
  },
  transition: { type: "tween" as const, ease: "linear", duration: 0.12 },
} as const;

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onSuccess: (user) => {
      useAuthStore.setState({ user });
      navigate("/board");
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="bg-linear-to-b from-brand-primary to-brand-secondary h-screen flex justify-center items-center">
      <div className="rounded-lg lg:border-4 lg:border-white lg:bg-transparent lg:p-2 gap-2 flex lg:min-w-[65%] h-full sm:h-[70%] lg:h-[80%]">
        <div className="lg:w-[50%] rounded-lg w-screen h-full sm:w-120 flex bg-white">
          <Form 
          title="Welcome" subtitle="Sign in to your account" 
          onSubmit={handleSubmit}>
            <FormField label="Email">
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Password">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>

            <div>
              <p className="lg:text-sm cursor-pointer">
                Forgot your password?{" "}
                <span className="text-brand-dark font-semibold hover:text-brand-secondary">
                  Click Here.
                </span>
              </p>
              {loginMutation.isError && (
                <p className="text-red-500 text-sm mt-1">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "Error al iniciar sesión"}
                </p>
              )}

              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </div>

            <div className="flex flex-col gap-4 mt-2 text-brand-muted">
              <div className="w-full text-center">
                <span>---- Or sign in with ----</span>
              </div>
              <FormRow>
                <SocialButton>
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4561 10.1543C21.5793 10.8125 21.6466 11.5016 21.6466 12.2214C21.6466 17.8447 17.8819 21.8438 12.197 21.8438C6.75844 21.8438 2.35327 17.4386 2.35327 12C2.35327 6.56142 6.75844 2.15625 12.197 2.15625C14.855 2.15625 17.0756 3.13439 18.7801 4.72172L16.005 7.49658V7.49025C14.9716 6.50578 13.6612 6.00141 12.197 6.00141C8.94872 6.00141 6.30933 8.74533 6.30933 11.994C6.30933 15.2419 8.94868 17.9925 12.197 17.9925C15.1441 17.9925 17.1495 16.3066 17.5623 13.9935H12.197V10.1543H21.4561Z" fill="currentColor" />
                  </svg>
                  Google
                </SocialButton>
                <SocialButton>
                  <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                   <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github [#142]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="currentColor"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]"> </path> </g> </g> </g> </g>
                  </svg>
                  Github
                </SocialButton>
              </FormRow>
              <div className="w-full text-center">
                <Link  to="/register" className="text-brand-muted cursor-pointer lg:text-sm">
                  Dont have a acount?{" "}
                  <span className="text-brand-dark font-semibold hover:text-brand-secondary">
                    Sign Up Here.
                  </span>
                </Link>
              </div>
            </div>
          </Form>
        </div>

        {width >= 1024 ? (
          <div className="lg:w-[50%]">
            <div>
              <ul className="flex justify-between w-full p-6 text-white font-bold">
                <motion.li className="cursor-pointer transition-all delay-75" {...listItemMotion}>
                  Register
                </motion.li>
                <motion.li className="cursor-pointer transition-all delay-75" {...listItemMotion}>
                  Login
                </motion.li>
                <motion.li
                  className="cursor-pointer transition-all delay-75"
                  {...listItemMotion}
                  onClick={() => navigate("/")}
                >
                  Home
                </motion.li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
