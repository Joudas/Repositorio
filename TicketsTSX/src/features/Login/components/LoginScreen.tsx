import { useState, type ChangeEvent } from "react";
import { useLogin } from "../context/LoginContext";

const LoginScreen = () => {

  const {loginData, setLoginData, mutate, error, isError} = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if(!loginData.password.trim() || !loginData.email.trim()) return;
    // Handle form submission
    mutate(loginData);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({...loginData, [e.target.name]: e.target.value});
  }

  return (
    <div className="grid min-h-screen grid-cols">
      <div className="h-full w-full flex justify-center items-center">
        <div className="w-[30%] justify-center items-center rounded-lg pb-30 pt-20 px-10 shadow-container-login">
          <div className="px-4">
            <p className="font-bold text-2xl">Iniciar Sesión</p>
            <p className="text-sm text-gray-400">Ingresa a tu cuenta para continuar</p>
          </div>
          <div>
            <form className="grid gap-24 mt-16 text-base" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1">
                <input 
                  value={loginData.email}
                  onChange={handleChange}
                  type="email" 
                  name="email"
                  className="border-b text-sm border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" 
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="border-b text-sm border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm"
                    placeholder="*****"
                    name='password'
                    value={loginData.password}
                    onChange={handleChange}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.228-10.862A10.025 10.025 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.064 10.064 0 01-5.891 5.891M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 h-10">
                {isError && <span className="text-sm text-red-500 w-full">{error?.message}</span>}
                <button type="submit" className="w-full h-10 btn-base cursor-pointer">Continuar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
