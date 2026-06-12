import React, { useContext, useEffect, useState } from 'react';
import RegisterContext from '../../Context/Register/RegisterContext';
import { Link } from 'react-router';
const RegisterPage = () => {

  const { handleState, handleChangeData, registerData } = useContext(RegisterContext);

  const [stateRegister, setStateRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerData.name && registerData.lastname && registerData.email) {
      handleState(2);
    } else {
      setStateRegister(true);
    }
  }

  useEffect(() => {

  },[])


  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="h-full w-full flex justify-center items-center border-r border-amber-400">
        <div className="h-[80%] w-[70%] justify-center items-center ">
          <div className="px-4">
            <p className="font-bold text-2xl">Registrarse</p>
            <p className="text-sm text-gray-400">Registrate para ser parte de nuestra comunidad</p>
          </div>
          <div>
            <form className="grid gap-24 mt-16 text-base" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-18">
                <div className="relative">
                  <input value={registerData.name} name="name" onChange={handleChangeData} className="border-b text-sm border-gray-300 py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" placeholder="Nombre"></input>
                  {stateRegister && <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg fill="#fb2c36" width="18px" height="18px" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>asterisk</title> <path d="M13.875 3.719l1.156 1.938-4.938 1.813 4.938 1.875-1.156 1.938-4.031-3.375 0.875 5.219h-2.281l0.938-5.219-4.094 3.375-1.125-1.938 5-1.875-5-1.813 1.125-1.938 4.094 3.375-0.938-5.219h2.281l-0.875 5.219z"></path> </g></svg>
                  </span>}
                </div>
                
                <input value={registerData.lastname} name="lastname" onChange={handleChangeData} className="border-b text-sm border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" placeholder="Apellido"></input>
              </div>
              <div className="grid grid-cols-1">
                <input value={registerData.rol} name="rol" onChange={handleChangeData} className="border-b text-sm border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" placeholder="Rol"></input>
              </div>
              <div className="relative">
                  <input value={registerData.email} name="email" onChange={handleChangeData} className="border-b text-sm border-gray-300 py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" placeholder="Email"></input>
                  {stateRegister && <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg fill="#fb2c36" width="18px" height="18px" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>asterisk</title> <path d="M13.875 3.719l1.156 1.938-4.938 1.813 4.938 1.875-1.156 1.938-4.031-3.375 0.875 5.219h-2.281l0.938-5.219-4.094 3.375-1.125-1.938 5-1.875-5-1.813 1.125-1.938 4.094 3.375-0.938-5.219h2.281l-0.875 5.219z"></path> </g></svg>
                  </span>}
                </div>
              <div className="grid grid-cols-4 gap-4">
                <select name="country" onChange={handleChangeData} className="border-b text-sm border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm" placeholder="Nombre">
                  <option defaultValue value="Colombia">Col&nbsp;&nbsp;🇨🇴</option>
                </select>
                <input value={registerData.phone} name="phone" onChange={handleChangeData} type="phone" className="border-b text-sm border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm col-span-3" placeholder="Telefono"></input>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {stateRegister && <p className="text-sm text-red-500">Por favor completa los campos requeridos</p>}
                <button type="submit" className="w-full h-10 btn-base cursor-pointer">Continuar</button>

                <div className="flex justify-between">
                  <button className="w-60 h-10 btn-google border justify-center items-center cursor-pointer gap-2">Registrarse Con Google <span><svg width="24px" height="24px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg></span></button>
                  <div className="grid grid-cols-1 items-center">
                    <Link to="/login">
                      <p className="text-sm text-gray-400">¿Ya tienes una cuenta? <span className="text-blue-500 cursor-pointer">Inicia sesión</span></p>
                    </Link>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
      <div className="h-full w-full "></div>
    </div>
  );
};

export default RegisterPage;
