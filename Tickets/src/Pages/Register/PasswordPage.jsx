import React, { useContext, useState } from 'react';
import RegisterContext from '../../Context/Register/RegisterContext';

const PasswordPage = () => {
  const { handleState, setPassword, password} = useContext(RegisterContext);
  
  const [showPassword, setShowPassword] = useState(false);
  const [statePassword, setStatePassword] = useState([]);
  const [stateInvalidPassword, setStateInvalidPassword] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    //Validamos que exista algo en 
    if(password == '' || statePassword[1] === "text-red-500"){
      setStateInvalidPassword(true);
      return;
    };
    handleState(3);
  }
  const backPage = () => {
    handleState(1);
  }

  const handlePasswordChange = (e) => {
      const value = e.target.value;
      if(value.length > 8) setStatePassword(["Contraseña Segura", "text-green-500"]);
      else if(value.length > 5) setStatePassword(["Contraseña Regular", "text-yellow-500"]);
      else if(value.length > 0) setStatePassword(["Contraseña Débil", "text-red-500"]);
      setPassword(value);
      return;
  } 

  return (
    <div className="grid min-h-screen grid-cols-1 relative">
      <div onClick={() => backPage()} className="absolute top-4 left-4 cursor-pointer btn-back rounded-full p-1">
        <svg width="32px" height="32px" fill="currentColor" viewBox="-7 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>left</title> <path d="M7.094 15.938l7.688 7.688-3.719 3.563-11.063-11.063 11.313-11.344 3.531 3.5z"></path> </g></svg>
      </div>
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="w-[30%] flex flex-col justify-center">
          <div className="px-4">
            <p className="font-bold text-2xl">Contraseña</p>
            <p className="text-sm text-gray-400">Recuerda que una buena contraseña es tu mayor muro de protección</p>
          </div>
          <div>
            <form className="grid gap-18 mt-16 text-base" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="border-b text-sm border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm"
                    placeholder="*****"
                    onChange={handlePasswordChange}
                    name='password'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-sm absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

                <span className={`text-sm ${statePassword[1]}`}>{statePassword[0]}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 h-10">
                {stateInvalidPassword && <span className="text-sm text-red-500">Campo Vacio o Invalido</span>}
                <button type="submit" className="w-full h-10 btn-base cursor-pointer">Continuar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="h-full w-full"></div>
    </div>
  );
};

export default PasswordPage;
